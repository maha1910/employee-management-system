import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { submitLeaveRequest, getEmployeeLeaveHistory } from "../../services/leaveService";
import "../../pages/Dashboard.css"; // Reuse same styles

const SubmitLeaveRequestPage = () => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  const fetchLeaveHistory = async () => {
    try {
      const history = await getEmployeeLeaveHistory(token);
      setLeaveHistory(history);
    } catch (error) {
      console.error("Failed to fetch leave history:", error);
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitLeaveRequest(formData, token);
      alert("Leave request submitted successfully!");
      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      fetchLeaveHistory(); // refresh history
    } catch (error) {
      alert("Failed to submit leave request.");
      console.error("Submission error:", error);
    }
  };

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
          <h1 className="dashboard-title">Submit Leave Request</h1>

          <form onSubmit={handleSubmit} className="dashboard-details" style={{ maxWidth: "600px" }}>
            <div className="detail-row">
              <label className="detail-label">
                <strong>Leave Type:</strong>
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="detail-input"
                required
              >
                <option value="">Select a type</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal Leave">Personal Leave</option>
              </select>
            </div>

            <div className="detail-row">
              <label className="detail-label">
                <strong>Start Date:</strong>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="detail-input"
                required
              />
            </div>

            <div className="detail-row">
              <label className="detail-label">
                <strong>End Date:</strong>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="detail-input"
                required
              />
            </div>

            <div className="detail-row">
              <label className="detail-label">
                <strong>Reason:</strong>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="detail-input"
                rows="4"
                required
              />
            </div>

            <div className="btn-group">
              <button type="submit" className="primary-btn">Submit Request</button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" })}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Leave History */}
        <div className="dashboard-card" style={{ marginTop: "30px" }}>
          <h2 className="dashboard-title">Your Leave History</h2>
          <div className="dashboard-details">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Submitted Date</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.length > 0 ? (
                  leaveHistory.map((request) => (
                    <tr key={request.id}>
                      <td>{request.submittedDate}</td>
                      <td>{request.leaveType}</td>
                      <td>{request.startDate}</td>
                      <td>{request.endDate}</td>
                      <td>{request.status}</td>
                      <td>{request.reason}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitLeaveRequestPage;
