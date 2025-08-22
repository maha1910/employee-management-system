package com.empconnect.employeemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignTaskRequest {

    private String assignedToUsername;
    private String title;
    private String description;
    private LocalDate dueDate; // 🟢 ADDED: Due date field
}