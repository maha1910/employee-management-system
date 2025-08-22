package com.empconnect.employeemanagement.dto;

import com.empconnect.employeemanagement.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private String assignedToName;
    private String assignedByName;
    private LocalDate assignedDate;
    private LocalDate dueDate;
}