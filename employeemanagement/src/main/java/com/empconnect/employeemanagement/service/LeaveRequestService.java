package com.empconnect.employeemanagement.service;

import com.empconnect.employeemanagement.dto.LeaveRequestResponse;
import com.empconnect.employeemanagement.model.LeaveRequest;
import com.empconnect.employeemanagement.model.LeaveStatus;
import com.empconnect.employeemanagement.model.User;
import com.empconnect.employeemanagement.repository.LeaveRequestRepository;
import com.empconnect.employeemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final EmailService emailService;

    private LeaveRequestResponse mapToResponseDto(LeaveRequest leaveRequest) {
        return new LeaveRequestResponse(
                leaveRequest.getId(),
                leaveRequest.getUser().getName(),
                leaveRequest.getLeaveType(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getReason(),
                leaveRequest.getStatus(),
                leaveRequest.getSubmittedDate()
        );
    }

    @Transactional
    public LeaveRequest submitLeaveRequest(Long userId, LeaveRequest leaveRequest) {
        User employee = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        leaveRequest.setUser(employee);
        leaveRequest.setStatus(LeaveStatus.PENDING);
        leaveRequest.setSubmittedDate(LocalDate.now());

        LeaveRequest newRequest = leaveRequestRepository.save(leaveRequest);

        User manager = employee.getManager();
        if (manager != null && manager.getEmail() != null) {
            String subject = "New Leave Request from " + employee.getName();
            String body = String.format(
                    "Dear %s,\n\nA new leave request has been submitted by %s from %s to %s.\nReason: %s",
                    manager.getName(), employee.getName(), leaveRequest.getStartDate(), leaveRequest.getEndDate(), leaveRequest.getReason()
            );
            emailService.sendEmail(manager.getEmail(), subject, body);
        }

        return newRequest;
    }

    @Transactional
    public LeaveRequestResponse approveLeaveRequest(Long requestId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is not pending and cannot be approved.");
        }

        User employee = leaveRequest.getUser();
        long numberOfDays = ChronoUnit.DAYS.between(leaveRequest.getStartDate(), leaveRequest.getEndDate()) + 1;
        int newBalance = employee.getLeaveBalance() - (int) numberOfDays;

        employee.setLeaveBalance(newBalance);
        userRepository.save(employee);
        leaveRequest.setStatus(LeaveStatus.APPROVED);
        LeaveRequest approvedRequest = leaveRequestRepository.save(leaveRequest);

        if (employee.getEmail() != null) {
            String subject = "Leave Request Approved";
            String body = String.format(
                    "Dear %s,\n\nYour leave request from %s to %s has been approved.",
                    employee.getName(), leaveRequest.getStartDate(), leaveRequest.getEndDate()
            );
            emailService.sendEmail(employee.getEmail(), subject, body);
        }

        return mapToResponseDto(approvedRequest); // 🟢 CORRECTED
    }

    @Transactional
    public LeaveRequestResponse rejectLeaveRequest(Long requestId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is not pending and cannot be rejected.");
        }

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        LeaveRequest rejectedRequest = leaveRequestRepository.save(leaveRequest);

        if (rejectedRequest.getUser().getEmail() != null) {
            String subject = "Leave Request Rejected";
            String body = String.format(
                    "Dear %s,\n\nYour leave request from %s to %s has been rejected.\nReason: %s",
                    rejectedRequest.getUser().getName(), rejectedRequest.getStartDate(), rejectedRequest.getEndDate(), rejectedRequest.getReason()
            );
            emailService.sendEmail(rejectedRequest.getUser().getEmail(), subject, body);
        }

        return mapToResponseDto(rejectedRequest); // 🟢 CORRECTED
    }

    public List<LeaveRequestResponse> getAllLeaveRequests() {
        return leaveRequestRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestResponse> getPendingLeaveRequests() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    // 🟢 CORRECTED
    public List<LeaveRequestResponse> getLeaveHistoryByUserId(Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return leaveRequestRepository.findByUser(user)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
}