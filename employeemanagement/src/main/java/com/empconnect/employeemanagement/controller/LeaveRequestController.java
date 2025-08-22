package com.empconnect.employeemanagement.controller;

import com.empconnect.employeemanagement.model.LeaveRequest;
import com.empconnect.employeemanagement.model.User;
import com.empconnect.employeemanagement.service.LeaveRequestService;
import com.empconnect.employeemanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.empconnect.employeemanagement.dto.LeaveRequestResponse;

import java.util.List;

@RestController
@RequestMapping("/leave-requests")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;
    private final UserService userService;

    @PostMapping("/submit")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<LeaveRequest> submitLeaveRequest(
            Authentication authentication,
            @RequestBody LeaveRequest leaveRequest) {

        String username = authentication.getName();
        User user = userService.getByUsername(username);
        LeaveRequest newRequest = leaveRequestService.submitLeaveRequest(user.getId(), leaveRequest);
        return ResponseEntity.ok(newRequest);
    }

    // 🟢 CORRECTED: Employee views their own leave history with DTO
    @GetMapping("/history")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<LeaveRequestResponse>> getLeaveHistory(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getByUsername(username);
        List<LeaveRequestResponse> history = leaveRequestService.getLeaveHistoryByUserId(user.getId());
        return ResponseEntity.ok(history);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveRequestResponse>> getAllLeaveRequests() {
        List<LeaveRequestResponse> requests = leaveRequestService.getAllLeaveRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveRequestResponse>> getPendingLeaveRequests() {
        List<LeaveRequestResponse> requests = leaveRequestService.getPendingLeaveRequests();
        return ResponseEntity.ok(requests);
    }

    // 🟢 CORRECTED: Returns DTO
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveRequestResponse> approveLeaveRequest(@PathVariable Long id) {
        LeaveRequestResponse approvedRequest = leaveRequestService.approveLeaveRequest(id);
        return ResponseEntity.ok(approvedRequest);
    }

    // 🟢 CORRECTED: Returns DTO
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveRequestResponse> rejectLeaveRequest(@PathVariable Long id) {
        LeaveRequestResponse rejectedRequest = leaveRequestService.rejectLeaveRequest(id);
        return ResponseEntity.ok(rejectedRequest);
    }
}