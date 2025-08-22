import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import * as adminService from "../../services/adminService";
import "../../pages/Dashboard.css"; // ✅ reuse same styles

const ManageEmployees = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({});
  const [managerUsernames, setManagerUsernames] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const underMe = await adminService.getEmployeesUnderMe(token);
        setEmployees(underMe);

        const allUsers = await adminService.getAllEmployees(token);
        setManagers(allUsers.filter(u => u.role === "ADMIN"));
      } catch (error) {
        console.error("Failed to fetch data:", error.response?.data || error.message);
      }
    };
    fetchData();
  }, [token]);

  const startEditEmployee = (emp) => {
    setEditingEmployee(emp.id);
    setEmployeeForm(emp);
  };

  const handleEmployeeChange = (e) => {
    setEmployeeForm({ ...employeeForm, [e.target.name]: e.target.value });
  };

  const saveEmployee = async () => {
    try {
      await adminService.updateEmployee(employeeForm.id, employeeForm, token);
      setEmployees(prev =>
        prev.map(emp => (emp.id === employeeForm.id ? employeeForm : emp))
      );
      setEditingEmployee(null);
    } catch (error) {
      console.error("Failed to update employee", error);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await adminService.deleteEmployee(id, token);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (error) {
      console.error("Failed to delete employee", error);
    }
  };

  const handleManagerChange = (id, value) => {
    setManagerUsernames({ ...managerUsernames, [id]: value });
  };

  const assignManager = async (employeeId) => {
    try {
      const managerUsername = managerUsernames[employeeId];
      if (!managerUsername) {
        alert("Please select a manager first.");
        return;
      }
      await adminService.assignManager(employeeId, managerUsername, token);
      alert("Manager assigned successfully!");
      setManagerUsernames({ ...managerUsernames, [employeeId]: "" });

      const updatedEmployees = await adminService.getEmployeesUnderMe(token);
      setEmployees(updatedEmployees);

    } catch (err) {
      console.error("Error assigning manager:", err.response?.data || err.message);
      alert(`Error assigning manager: ${err.response?.data?.message || err.message}`);
    }
  };

  const filteredEmployees = employees.filter(
    emp =>
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      {/* Hamburger menu */}
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
          <h1 className="dashboard-title">My Employees</h1>

          <input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="detail-input"
            style={{ maxWidth: "300px", marginBottom: "15px" }}
          />

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f1f5f9" }}>
                <tr>
                  <th className="detail-label">Name</th>
                  <th className="detail-label">Email</th>
                  <th className="detail-label">Role</th>
                  <th className="detail-label">Department</th>
                  <th className="detail-label">Manager</th>
                  <th className="detail-label">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td>
                        {editingEmployee === emp.id ? (
                          <input
                            name="name"
                            value={employeeForm.name || ""}
                            onChange={handleEmployeeChange}
                            className="detail-input"
                          />
                        ) : emp.name}
                      </td>
                      <td>
                        {editingEmployee === emp.id ? (
                          <input
                            name="email"
                            value={employeeForm.email || ""}
                            onChange={handleEmployeeChange}
                            className="detail-input"
                          />
                        ) : emp.email}
                      </td>
                      <td>
                        {editingEmployee === emp.id ? (
                          <input
                            name="role"
                            value={employeeForm.role || ""}
                            onChange={handleEmployeeChange}
                            className="detail-input"
                          />
                        ) : emp.role}
                      </td>
                      <td>
                        {editingEmployee === emp.id ? (
                          <input
                            name="department"
                            value={employeeForm.department || ""}
                            onChange={handleEmployeeChange}
                            className="detail-input"
                          />
                        ) : emp.department}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <select
                            value={managerUsernames[emp.id] || ""}
                            onChange={(e) => handleManagerChange(emp.id, e.target.value)}
                            className="detail-input"
                          >
                            <option value="">Select Manager</option>
                            {managers.map((mgr) => (
                              <option key={mgr.id} value={mgr.username}>
                                {mgr.name}
                              </option>
                            ))}
                          </select>
                          <button className="action-btn primary" onClick={() => assignManager(emp.id)}>
                            Assign
                          </button>
                        </div>
                      </td>
                      <td>
                        {editingEmployee === emp.id ? (
                          <div className="action-buttons">
                            <button className="action-btn primary" onClick={saveEmployee}>Save</button>
                            <button className="action-btn secondary" onClick={() => setEditingEmployee(null)}>Cancel</button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button className="action-btn secondary" onClick={() => startEditEmployee(emp)}>Edit</button>
                            <button className="action-btn danger" onClick={() => deleteEmployee(emp.id)}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                      No employees found.
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

export default ManageEmployees;
