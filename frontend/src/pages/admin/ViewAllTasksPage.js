import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import * as taskService from "../../services/taskService";

const ViewAllTasksPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAllTasks = async () => {
    try {
      const allTasks = await taskService.getAllTasks(token);
      setTasks(allTasks);
    } catch (error) {
      console.error("Failed to fetch all tasks:", error);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, [token]);

  return (
    <>
      <Navbar />
      {/* Sidebar toggle button */}
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

      {/* Main content */}
      <div
        style={{
          marginLeft: sidebarOpen ? "220px" : "0",
          padding: "2rem",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            maxWidth: "1100px",
            margin: "auto",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>All Tasks</h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", borderBottom: "2px solid #e2e8f0" }}>Title</th>
                <th style={{ padding: "12px 16px", borderBottom: "2px solid #e2e8f0" }}>Description</th>
                <th style={{ padding: "12px 16px", borderBottom: "2px solid #e2e8f0" }}>Status</th>
                <th style={{ padding: "12px 16px", borderBottom: "2px solid #e2e8f0" }}>Assigned To</th>
                <th style={{ padding: "12px 16px", borderBottom: "2px solid #e2e8f0" }}>Assigned By</th>
                <th style={{ padding: "12px 16px", borderBottom: "2px solid #e2e8f0" }}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr
                    key={task.id}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <td style={{ padding: "12px 16px" }}>{task.title}</td>
                    <td style={{ padding: "12px 16px" }}>{task.description}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          background:
                            task.status === "Completed"
                              ? "#bbf7d0"
                              : task.status === "Pending"
                              ? "#fef9c3"
                              : "#e0f2fe",
                          color:
                            task.status === "Completed"
                              ? "#166534"
                              : task.status === "Pending"
                              ? "#92400e"
                              : "#075985",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {task.assignedToName || "N/A"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {task.assignedByName || "N/A"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#64748b",
                    }}
                  >
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewAllTasksPage;
