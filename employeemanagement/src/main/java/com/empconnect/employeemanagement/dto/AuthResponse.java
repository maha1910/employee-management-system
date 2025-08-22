package com.empconnect.employeemanagement.dto;

public class AuthResponse {
    private String username;
    private String token;
    private String role;
    private String name;

    public AuthResponse(String username, String token, String role, String name) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.name = name;
    }


    // Getter
    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public String getName() { return name; }
}
