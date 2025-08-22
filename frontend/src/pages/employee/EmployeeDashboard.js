import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import authService from "../../services/authService";
import "../../pages/Dashboard.css"; // Keep your dashboard styles

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Editable fields
  const editableFields = [
    "phoneNumber",
    "emergencyContact",
    "address",
    "education",
    "certifications",
    "skills",
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getCurrentUser();
        setUser(data);
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await authService.updateProfile(formData);
      setUser(formData);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      {/* Navbar remains unchanged */}
      <Navbar />

      {/* Hamburger Menu */}
      <div style={{ position: "absolute", top: "15px", left: "15px", zIndex: 1100,  }}>
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

      {/* Sidebar with slide-in animation */}
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

      {/* Dashboard Content shifts with sidebar */}
      <div style={{ marginLeft: sidebarOpen ? "220px" : "0", padding: "2rem", width: "100%" }}>
        <div className="dashboard-card">
          <h1 className="dashboard-title">Employee Dashboard</h1>
          <p className="welcome-text">
            Welcome, <strong>{user.name}</strong>
          </p>

          <div className="dashboard-details">
            {Object.keys(user).map((key) => {
              if (
                [
                  "id",
                  "_id",
                  "createdAt",
                  "updatedAt",
                  "passwordHash",
                  "password",
                  "profileCompleted",
                  "manager",
                ].includes(key)
              ) {
                return null;
              }

              const label = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase());

              return (
                <div key={key} className="detail-row">
                  <label className="detail-label">
                    <strong>{label}:</strong>
                  </label>
                  {editMode && editableFields.includes(key) ? (
                    <input
                      className="detail-input"
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <span className="detail-value">
                      {typeof user[key] === "object" && user[key] !== null
                        ? JSON.stringify(user[key])
                        : user[key] || "Not set"}
                    </span>
                  )}
                </div>
              );
            })}

            {user.manager && user.manager.name && (
              <div className="detail-row">
                <label className="detail-label">
                  <strong>Manager:</strong>
                </label>
                <span className="detail-value">{user.manager.name}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="btn-group">
              {editMode ? (
                <>
                  <button className="primary-btn" onClick={handleSave}>
                    Save
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button className="primary-btn" onClick={() => setEditMode(true)}>
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
