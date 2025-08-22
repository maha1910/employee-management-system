import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  getPendingLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "../../services/leaveService";
import "../../pages/Dashboard.css"; // Reuse styles

const ManageLeaveRequestsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const token = localStorage.getItem("token");

  const fetchPendingRequests = async () => {
    try {
      const requests = await getPendingLeaveRequests(token);
      setPendingRequests(requests);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      await approveLeaveRequest(id, token);
      alert("Leave request approved!");
      fetchPendingRequests();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to approve request.";
      alert(errorMessage);
      console.error("Approval error:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectLeaveRequest(id, token);
      alert("Leave request rejected.");
      fetchPendingRequests();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reject request.";
      alert(errorMessage);
      console.error("Rejection error:", error);
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
          <h1 className="dashboard-title">Manage Leave Requests</h1>

          <div style={{ overflowX: "auto" }}>
            <table
              className="leave-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                  <th>Employee Name</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.employeeName}</td>
                      <td>{request.leaveType}</td>
                      <td>{request.startDate}</td>
                      <td>{request.endDate}</td>
                      <td>{request.reason}</td>
                      <td>{request.status}</td>
                      <td>
                        {request.status === "PENDING" ? (
                          <div className="action-buttons">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="action-btn ok"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="action-btn danger"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span>{request.status}</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No pending leave requests.
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

export default ManageLeaveRequestsPage;
