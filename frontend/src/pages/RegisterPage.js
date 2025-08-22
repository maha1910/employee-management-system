import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css"; // import theme

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        role: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate("/login");
            } else {
                const errorMsg = await response.text();
                setError(errorMsg || "Registration failed");
            }
        } catch (err) {
            setError("Failed to connect to server");
        }
    };

    return (
        <div className="auth-container">
            <h2>Welcome to EmpConnect</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <span
                    onClick={togglePasswordVisibility}
                    className="show-password-toggle"
                >
                    {showPassword ? "Hide Password" : "Show Password"}
                </span>
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option>Select the role</option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                <button type="submit">Register</button>
            </form>
            <p>
                Already registered? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default RegisterPage;