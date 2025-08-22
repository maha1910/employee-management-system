package com.empconnect.employeemanagement.service.impl;

import com.empconnect.employeemanagement.model.Task;
import com.empconnect.employeemanagement.model.User;
import com.empconnect.employeemanagement.model.TaskStatus;
import com.empconnect.employeemanagement.dto.AssignTaskRequest;
import com.empconnect.employeemanagement.dto.TaskResponse;
import com.empconnect.employeemanagement.repository.TaskRepository;
import com.empconnect.employeemanagement.repository.UserRepository;
import com.empconnect.employeemanagement.service.TaskService;
import com.empconnect.employeemanagement.service.EmailService;
import com.empconnect.employeemanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final UserService userService;

    private TaskResponse mapToResponseDto(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getAssignedTo().getName(),
                task.getAssignedBy().getName(),
                task.getAssignedDate(),
                task.getDueDate()
        );
    }

    @Override
    @Transactional
    public TaskResponse updateStatus(Long taskId, TaskStatus status, String username) throws IllegalAccessException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (task.getAssignedTo() == null || !task.getAssignedTo().getUsername().equals(username)) {
            throw new IllegalAccessException("You are not allowed to update this task");
        }

        // 🟢 NEW LOGIC: Prevent status from being backtracked
        if (task.getStatus() == TaskStatus.COMPLETED || task.getStatus() == TaskStatus.CANCELLED) {
            throw new IllegalStateException("Cannot update a completed or cancelled task.");
        }
        if (task.getStatus() == TaskStatus.IN_PROGRESS && status == TaskStatus.PENDING) {
            throw new IllegalStateException("Cannot move a task from IN_PROGRESS back to PENDING.");
        }

        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);

        User assignedBy = updatedTask.getAssignedBy();
        if (assignedBy != null && assignedBy.getEmail() != null) {
            String subject = "Task Status Updated: " + updatedTask.getTitle();
            String body = String.format(
                    "Dear %s,\n\nThe status of the task '%s' assigned to %s has been updated to %s.",
                    assignedBy.getName(), updatedTask.getTitle(), updatedTask.getAssignedTo().getName(), updatedTask.getStatus()
            );
            emailService.sendEmail(assignedBy.getEmail(), subject, body);
        }

        return mapToResponseDto(updatedTask); // 🟢 CORRECTED: Return DTO
    }

    @Override
    @Transactional
    public Task assignTask(AssignTaskRequest req, String assignedByUsername) {
        User assignedBy = userRepository.findByUsername(assignedByUsername)
                .orElseThrow(() -> new RuntimeException("Assigner not found"));

        Optional<User> userOpt = userRepository.findByUsername(req.getAssignedToUsername());
        User assignedTo = userOpt.orElseThrow(() -> new RuntimeException("Assignee not found"));

        Task task = new Task();
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setAssignedTo(assignedTo);
        task.setAssignedBy(assignedBy);
        task.setAssignedDate(LocalDate.now());
        task.setDueDate(req.getDueDate());
        task.setStatus(TaskStatus.PENDING);

        Task savedTask = taskRepository.save(task);

        if (assignedTo.getEmail() != null) {
            String subject = "New Task Assigned: " + task.getTitle();
            String body = String.format(
                    "Dear %s,\n\nYou have been assigned a new task: %s\nDescription: %s\nDue Date: %s",
                    assignedTo.getName(), task.getTitle(), task.getDescription(), task.getDueDate()
            );
            emailService.sendEmail(assignedTo.getEmail(), subject, body);
        }

        return savedTask;
    }

    @Override
    public List<TaskResponse> getTasksAssignedToUser(String username) {
        User user = userService.getByUsername(username);
        return taskRepository.findByAssignedTo(user)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
}