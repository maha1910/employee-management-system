package com.empconnect.employeemanagement.service;

import com.empconnect.employeemanagement.model.Task;
import com.empconnect.employeemanagement.model.TaskStatus;
import com.empconnect.employeemanagement.dto.AssignTaskRequest;
import com.empconnect.employeemanagement.dto.TaskResponse;
import java.util.List;

public interface TaskService {

    List<TaskResponse> getTasksAssignedToUser(String username);

    // 🟢 CORRECTED: Method now returns a TaskResponse DTO
    TaskResponse updateStatus(Long taskId, TaskStatus status, String username) throws IllegalAccessException;

    List<TaskResponse> getAllTasks();

    Task assignTask(AssignTaskRequest req, String assignedByUsername);
}