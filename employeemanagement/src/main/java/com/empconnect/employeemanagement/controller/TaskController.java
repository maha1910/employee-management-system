package com.empconnect.employeemanagement.controller;

import com.empconnect.employeemanagement.model.Task;
import com.empconnect.employeemanagement.model.TaskStatus;
import com.empconnect.employeemanagement.dto.AssignTaskRequest;
import com.empconnect.employeemanagement.dto.TaskResponse;
import com.empconnect.employeemanagement.repository.UserRepository;
import com.empconnect.employeemanagement.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    @GetMapping("/user")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<List<TaskResponse>> getUserTasks(Authentication authentication) {
        String username = extractUsername(authentication);
        List<TaskResponse> tasks = taskService.getTasksAssignedToUser(username);
        return ResponseEntity.ok(tasks);
    }

    // 🟢 CORRECTED: Returns TaskResponse DTO
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication
    ) {
        String username = extractUsername(authentication);
        String statusString = body.get("status");
        if (statusString == null || statusString.isBlank()) {
            return ResponseEntity.badRequest().body(new TaskResponse()); // Return empty DTO on bad request
        }

        try {
            TaskStatus status = TaskStatus.valueOf(statusString.toUpperCase());
            TaskResponse updated = taskService.updateStatus(id, status, username);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new TaskResponse());
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(403).body(new TaskResponse());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new TaskResponse());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        List<TaskResponse> all = taskService.getAllTasks();
        return ResponseEntity.ok(all);
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Task> assignTask(@Valid @RequestBody AssignTaskRequest req, Authentication authentication) {
        String assignedByUsername = extractUsername(authentication);
        try {
            Task createdTask = taskService.assignTask(req, assignedByUsername);
            return ResponseEntity.ok(createdTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    private String extractUsername(Authentication authentication) {
        if (authentication == null) return null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails ud) {
            return ud.getUsername();
        } else {
            return principal.toString();
        }
    }
}