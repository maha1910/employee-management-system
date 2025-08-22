package com.empconnect.employeemanagement.repository;

import com.empconnect.employeemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    // UserRepository.java
    List<User> findByManagerName(String managerName);

    List<User> findByManager(User manager);
// for login/checking user existence
}
