package com.empconnect.employeemanagement.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Basic login/auth fields
    private String username;    // used for login
    private String password;

    // 🔹 Role for dashboard navigation (set at registration)
    private String role; // ADMIN or EMPLOYEE

    // 🔹 Job position/title in the company (editable by admin)
    private String exactRole; // e.g., "Software Engineer", "HR Manager"

    // 🔹 Personal info
    private String employeeId;  // e.g., EMP001
    private String name;        // Single name field
    private String email;
    private String phoneNumber;
    private String address;
    private String emergencyContact;

    // 🔹 Demographics
    private String dateOfBirth;
    private Integer age;
    private String gender;
    private String nationality;

    // 🔹 Education & Skills
    private String education;
    private String certifications;
    private String skills;

    // 🔹 Employment info
    private String department;
    private String employmentType; // Full-time / Intern / Contract

    // Manager relationship
    // Reference to another user (manager)

    private String managerName; // Optional for quick display
    private Double experience; // in years
    private String joiningDate;
    private Integer leaveBalance;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;

    // 🔹 For first-time login prompt
    private boolean profileCompleted = false;

    public User() {}

    // Minimal constructor for registration
    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // ✅ Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getExactRole() { return exactRole; }
    public void setExactRole(String exactRole) { this.exactRole = exactRole; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }


    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public Double getExperience() { return experience; }
    public void setExperience(Double experience) { this.experience = experience; }

    public String getJoiningDate() { return joiningDate; }
    public void setJoiningDate(String joiningDate) { this.joiningDate = joiningDate; }

    public Integer getLeaveBalance() { return leaveBalance; }
    public void setLeaveBalance(Integer leaveBalance) { this.leaveBalance = leaveBalance; }

    public boolean isProfileCompleted() { return profileCompleted; }
    public void setProfileCompleted(boolean profileCompleted) { this.profileCompleted = profileCompleted; }

    public User getManager() {
        return manager;
    }

    public void setManager(User manager) {
        this.manager = manager;
    }

}
