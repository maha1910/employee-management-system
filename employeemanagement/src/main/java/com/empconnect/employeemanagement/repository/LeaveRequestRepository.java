package com.empconnect.employeemanagement.repository;

import com.empconnect.employeemanagement.model.LeaveRequest;
import com.empconnect.employeemanagement.model.LeaveStatus; // 🟢 ADD THIS LINE
import com.empconnect.employeemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByUser(User user);

    // This method will now resolve correctly
    List<LeaveRequest> findByStatus(LeaveStatus status);
}