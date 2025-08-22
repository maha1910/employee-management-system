package com.empconnect.employeemanagement.service;

import com.empconnect.employeemanagement.model.User;
import com.empconnect.employeemanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Find user by username (login name)
    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    // Save new user
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Update all editable profile fields
    private boolean hasValue(String value) {
        return value != null && !value.trim().isEmpty();
    }

    // ...
    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Update the name and username fields
        if (hasValue(updatedUser.getName())) existingUser.setName(updatedUser.getName());
        if (hasValue(updatedUser.getUsername())) existingUser.setUsername(updatedUser.getUsername());

        // Existing update logic for other fields
        if (hasValue(updatedUser.getAddress())) existingUser.setAddress(updatedUser.getAddress());
        if (updatedUser.getAge() != null) existingUser.setAge(updatedUser.getAge());
        if (hasValue(updatedUser.getCertifications())) existingUser.setCertifications(updatedUser.getCertifications());
        if (updatedUser.getDateOfBirth() != null) existingUser.setDateOfBirth(updatedUser.getDateOfBirth());
        if (hasValue(updatedUser.getDepartment())) existingUser.setDepartment(updatedUser.getDepartment());
        if (hasValue(updatedUser.getEducation())) existingUser.setEducation(updatedUser.getEducation());
        if (hasValue(updatedUser.getEmail())) existingUser.setEmail(updatedUser.getEmail());
        if (hasValue(updatedUser.getEmergencyContact())) existingUser.setEmergencyContact(updatedUser.getEmergencyContact());
        if (hasValue(updatedUser.getEmployeeId())) existingUser.setEmployeeId(updatedUser.getEmployeeId());
        if (hasValue(updatedUser.getEmploymentType())) existingUser.setEmploymentType(updatedUser.getEmploymentType());
        if (hasValue(updatedUser.getExactRole())) existingUser.setExactRole(updatedUser.getExactRole());
        if (updatedUser.getExperience() != null) existingUser.setExperience(updatedUser.getExperience());
        if (hasValue(updatedUser.getGender())) existingUser.setGender(updatedUser.getGender());
        if (updatedUser.getJoiningDate() != null) existingUser.setJoiningDate(updatedUser.getJoiningDate());
        if (updatedUser.getLeaveBalance() != null) existingUser.setLeaveBalance(updatedUser.getLeaveBalance());
        if (hasValue(updatedUser.getManagerName())) existingUser.setManagerName(updatedUser.getManagerName());
        if (hasValue(updatedUser.getNationality())) existingUser.setNationality(updatedUser.getNationality());
        if (hasValue(updatedUser.getPhoneNumber())) existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        if (hasValue(updatedUser.getSkills())) existingUser.setSkills(updatedUser.getSkills());

        if (isProfileComplete(existingUser)) {
            existingUser.setProfileCompleted(true);
        }

        return userRepository.save(existingUser);
    }
// ...



    // Admin updates only the exact_role
    public User updateExactRole(Long id, String exactRole) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        existingUser.setExactRole(exactRole);
        return userRepository.save(existingUser);
    }

    @Transactional
    public void updateRole(Long employeeId, String role) {
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + employeeId));

        user.setRole(role.toUpperCase()); // e.g., EMPLOYEE, ADMIN
        userRepository.save(user);
    }
    // Helper to check profile completeness
    private boolean isProfileComplete(User user) {
        return user.getAddress() != null &&
                user.getAge() != null &&
                user.getEducation() != null &&
                user.getEmail() != null &&
                user.getExactRole() != null &&
                user.getPhoneNumber() != null;
    }

    public List<User> getAllUsersExcludingSensitive() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::removeSensitiveFields).toList();
    }

    public User getUserByIdExcludingSensitive(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return removeSensitiveFields(user);
    }

    public void assignManager(Long employeeId, String managerUsername) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        User manager = userRepository.findByUsername(managerUsername)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        employee.setManager(manager);
        userRepository.save(employee);
    }



    // Helper to strip managerName & profileCompleted before sending to frontend
    private User removeSensitiveFields(User user) {
        user.setProfileCompleted(false); // or null if Boolean
        return user;
    }

    // UserService.java
    public List<User> getEmployeesUnderManager(String managerUsername) {
        User manager = userRepository.findByUsername(managerUsername)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        // Assuming your User entity has a 'manager' field pointing to another User
        return userRepository.findByManager(manager);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}
