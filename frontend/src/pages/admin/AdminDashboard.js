import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import authService from "../../services/authService";
import "../../pages/Dashboard.css"; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getCurrentUser();
        setUser(data);
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch admin profile", error);
      }
    };

    fetchUser();
  }, []);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
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
      <Navbar />

      {/* Hamburger Menu */}
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

      {/* Main Content */}
      <div style={{ marginLeft: sidebarOpen ? "220px" : "0", padding: "2rem", width: "100%" }}>
        <div className="dashboard-card">
          <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="welcome-text">
          Welcome, <strong>{user.name}</strong>
        </p>

        <div className="dashboard-details">
          {Object.keys(user).map((key) => {
          if (
            ["id", "_id", "createdAt", "updatedAt", "passwordHash", "password", "managerName", "profileCompleted", "manager"].includes(key)
          ) {
            return null;
          }
          const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
          return (
            <div key={key} className="detail-row">
              <label className="detail-label"><strong>{label}:</strong></label>
              {editMode ? (
                <input
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleProfileChange}
                  style={{ marginLeft: "10px" }}
                />
              ) : (
                <span className="detail-value">{user[key] || "Not set"}</span>
              )}
            </div>
          );
        })}

        <div className="btn-group">
          {editMode ? (
          <>
            <button onClick={saveProfile} className="primary-btn">Save</button>
            <button onClick={() => setEditMode(false)} className="secondary-btn">Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)} className="primary-btn">Edit</button>
        )}
        </div>
        
        </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
