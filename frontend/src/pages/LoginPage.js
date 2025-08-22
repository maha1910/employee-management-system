import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import "../App.css"; // import theme

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login(username, password);
            const { token, role, name } = response;
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("name", name);
            const userData = await authService.getCurrentUser();

            if (role === "ADMIN") {
                if (!userData.profileCompleted) {
                    navigate("/complete-profile");
                    return;
                }
                navigate("/admin");
            } else if (role === "EMPLOYEE") {
                if (!userData.profileCompleted) {
                    navigate("/complete-profile");
                    return;
                }
                navigate("/employee");
            } else {
                navigate("/unauthorized");
            }
        } catch (error) {
            console.error(error);
            alert("Login failed. Please check your credentials.");
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="auth-container">
            <h2>Welcome to EmpConnect</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <span
                    onClick={togglePasswordVisibility}
                    className="show-password-toggle"
                >
                    {showPassword ? "Hide Password" : "Show Password"}
                </span>
                <button type="submit">Login</button>
            </form>
            <p>
                New user? <Link to="/register" >Register now</Link>
            </p>
        </div>
    );
};

export default LoginPage;