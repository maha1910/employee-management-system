package com.empconnect.employeemanagement.controller;

import com.empconnect.employeemanagement.model.User;
import com.empconnect.employeemanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ✅ Any authenticated user can see their own profile
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.getByUsername(username));
    }

    // ✅ Any authenticated user can update their own profile
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateCurrentUser(Authentication authentication, @RequestBody User updatedUser) {
        String username = authentication.getName();
        User existingUser = userService.getByUsername(username);
        return ResponseEntity.ok(userService.updateUser(existingUser.getId(), updatedUser));
    }

    // ✅ Admin can update any user
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUser(id, updatedUser));
    }

    // ✅ Admin can view all users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsersExcludingSensitive());
    }

    // ✅ Admin can view any user by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserByIdExcludingSensitive(id));
    }

    // ✅ Admin can assign managers
    @PutMapping("/{id}/assign-manager")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> assignManager(
            @PathVariable Long id,
            @RequestParam String managerName) {
        try {
            userService.assignManager(id, managerName);
            return ResponseEntity.ok("Manager assigned successfully");
        } catch (RuntimeException e) {
            // Catch the specific exceptions and return a proper HTTP status code
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }


    // UserController.java
    @GetMapping("/employees-under-me")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getEmployeesUnderMe(Principal principal) {
        String managerUsername = principal.getName();
        List<User> employees = userService.getEmployeesUnderManager(managerUsername);
        return ResponseEntity.ok(employees); // Always return 200 with [] if no employees
    }



    @PutMapping("/change-role/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> changeRole(@PathVariable Long employeeId, @RequestParam String role) {
        userService.updateRole(employeeId, role);
        return ResponseEntity.ok("Role updated successfully");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

}
