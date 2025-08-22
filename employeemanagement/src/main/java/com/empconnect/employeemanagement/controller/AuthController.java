package com.empconnect.employeemanagement.controller;

import java.util.*;
import com.empconnect.employeemanagement.config.JwtUtil;
import com.empconnect.employeemanagement.dto.AuthRequest;
import com.empconnect.employeemanagement.dto.UserRequest;
import com.empconnect.employeemanagement.dto.AuthResponse;
import com.empconnect.employeemanagement.model.User;
import com.empconnect.employeemanagement.repository.UserRepository;
import com.empconnect.employeemanagement.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🟩 Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequest userRequest) {
        // 1️⃣ Validate input
        if (userRequest.getUsername() == null || userRequest.getUsername().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("errorCode", "INVALID_USERNAME", "message", "Username cannot be empty"));
        }
        if (userRequest.getPassword() == null || userRequest.getPassword().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("errorCode", "INVALID_PASSWORD", "message", "Password must be at least 6 characters"));
        }
        if (userRequest.getRole() == null || userRequest.getRole().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("errorCode", "INVALID_ROLE", "message", "Role is required"));
        }

        // 2️⃣ Exact-match username check (case-sensitive)
        Optional<User> existingUser = userRepository.findByUsername(userRequest.getUsername());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT) // 409 Conflict
                    .body(Map.of("errorCode", "USERNAME_EXISTS", "message", "Username already exists"));
        }

        // 3️⃣ Create and save user with default values
        User user = new User();
        user.setName(userRequest.getName());
        user.setUsername(userRequest.getUsername());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setRole(userRequest.getRole().toUpperCase());

        // 🟢 NEW LOGIC: Set the leave balance and default manager
        user.setLeaveBalance(25); // Set default leave balance

        // Find the default manager and assign them
        Optional<User> defaultManagerOptional = userRepository.findByUsername("Mahalakshmi_B"); // Assuming 'Mahalakshmi_B' is the manager's username
        defaultManagerOptional.ifPresent(defaultManager -> {
            user.setManager(defaultManager);
            user.setManagerName(defaultManager.getName());
        });

        userRepository.save(user);

        // 4️⃣ Success response
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully"));
    }



    // 🟩 Login and get JWT
    // 🟩 Login and get JWT + role
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest loginRequest) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // Get authenticated user details
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // Generate JWT token
            String token = jwtUtil.generateToken(userDetails.getUsername());

            // Fetch user from database to get role
            Optional<User> userOptional = userRepository.findByUsername(userDetails.getUsername());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = userOptional.get();

            // Build response with username, token, and role
            Map<String, String> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("token", token);
            response.put("role", user.getRole());
            response.put("name", user.getName());
            response.put("id", String.valueOf(user.getId()));
            response.put("employeeid", user.getEmployeeId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }



}
