package com.empconnect.employeemanagement.repository;

import com.empconnect.employeemanagement.model.Task;
import com.empconnect.employeemanagement.model.User;
import com.empconnect.employeemanagement.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // 🟢 NEW: Find all tasks assigned to a specific user entity
    List<Task> findByAssignedTo(User user);

    // Find all tasks assigned by a specific user
    List<Task> findByAssignedBy(User user);

    // Find tasks by assigned user and status
    List<Task> findByAssignedToAndStatus(User user, TaskStatus status);
}