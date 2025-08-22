import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import * as adminService from "../../services/adminService";
import * as taskService from "../../services/taskService";
import "../../pages/Dashboard.css"; // Reuse same styles

const AssignTaskPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    assignedToUsername: "",
    title: "",
    description: "",
    dueDate: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const allUsers = await adminService.getAllEmployees(token);
        const employeeUsers = allUsers.filter(
          (user) => user.role === "EMPLOYEE"
        );
        setEmployees(employeeUsers);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskService.assignTask(formData, token);
      alert("Task assigned successfully!");
      setFormData({
        assignedToUsername: "",
        title: "",
        description: "",
        dueDate: "",
      });
    } catch (error) {
      alert("Failed to assign task.");
      console.error("Assignment error:", error);
    }
  };

  return (
    <>
      <Navbar />

      {/* Hamburger Menu */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          left: "15px",
          zIndex: 1100,
        }}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            color: "white",
          }}
        >
          &#9776;
        </button>
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? "0" : "-220px",
          height: "100%",
          width: "240px",
          backgroundColor: "#2c3e50",
          color: "#fff",
          transition: "left 0.3s ease-in-out",
          zIndex: 1000,
          overflowY: "auto",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarOpen ? "220px" : "0",
          padding: "2rem",
          width: "100%",
        }}
      >
        <div className="dashboard-card">
          <h1 className="dashboard-title">Assign New Task</h1>

          <form
            onSubmit={handleSubmit}
            className="dashboard-details"
            style={{ maxWidth: "600px" }}
          >
            <div className="detail-row">
              <label className="detail-label">
                <strong>Assign To:</strong>
              </label>
              <select
                name="assignedToUsername"
                value={formData.assignedToUsername}
                onChange={handleChange}
                className="detail-input"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.username}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="detail-row">
              <label className="detail-label">
                <strong>Task Title:</strong>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="detail-input"
                required
              />
            </div>

            <div className="detail-row">
              <label className="detail-label">
                <strong>Description:</strong>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="detail-input"
                rows="4"
                required
              />
            </div>

            <div className="detail-row">
              <label className="detail-label">
                <strong>Due Date:</strong>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="detail-input"
                required
              />
            </div>

            <div className="btn-group">
              <button type="submit" className="primary-btn">
                Assign Task
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  setFormData({
                    assignedToUsername: "",
                    title: "",
                    description: "",
                    dueDate: "",
                  })
                }
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AssignTaskPage;
