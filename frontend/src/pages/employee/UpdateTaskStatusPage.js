import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import * as taskService from "../../services/taskService";

const UpdateTaskStatusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [task, setTask] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const myTasks = await taskService.getMyTasks(token);
        const currentTask = myTasks.find((t) => t.id === parseInt(id));
        setTask(currentTask);
        if (currentTask) {
          setNewStatus(currentTask.status);
        }
      } catch (error) {
        console.error("Failed to fetch task details:", error);
      }
    };
    fetchTask();
  }, [id, token]);

  const handleUpdate = async () => {
    try {
      await taskService.updateTaskStatus(id, newStatus, token);
      alert("✅ Task status updated successfully!");
      navigate("/employee/view-tasks");
    } catch (error) {
      alert("❌ Failed to update task status.");
      console.error("Update error:", error);
    }
  };

  if (!task) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        Loading task details...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {/* Sidebar toggle button */}
      <div style={{ position: "absolute", top: "15px", left: "15px", zIndex: 1100 }}>
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

      {/* Main content */}
      <div style={{ marginLeft: sidebarOpen ? "220px" : "0", padding: "2rem", width: "100%" }}>
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            maxWidth: "700px",
            margin: "auto",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Update Task Status</h2>

          {/* Task details card */}
          <div style={{ marginBottom: "20px", lineHeight: "1.6" }}>
            <h3 style={{ marginBottom: "10px", color: "#0f172a" }}>{task.title}</h3>
            <p><strong>Description:</strong> {task.description}</p>
            <p>
              <strong>Current Status:</strong>{" "}
              <span
                style={{
                  background:
                    task.status === "COMPLETED"
                      ? "#bbf7d0"
                      : task.status === "PENDING"
                      ? "#fef9c3"
                      : task.status === "IN_PROGRESS"
                      ? "#e0f2fe"
                      : "#fee2e2",
                  color:
                    task.status === "COMPLETED"
                      ? "#166534"
                      : task.status === "PENDING"
                      ? "#92400e"
                      : task.status === "IN_PROGRESS"
                      ? "#075985"
                      : "#991b1b",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                }}
              >
                {task.status}
              </span>
            </p>
            <p><strong>Assigned By:</strong> {task.assignedByName || "N/A"}</p>
            <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</p>
          </div>

          {/* Status update form */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ fontWeight: "500" }}>New Status:</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "0.9rem",
                background: "#f8fafc",
              }}
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <button
              onClick={handleUpdate}
              style={{
                background: "#437aef",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateTaskStatusPage;
