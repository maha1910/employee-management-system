// src/services/adminService.js
import axios from "axios";

const API_URL = "http://localhost:8080/users"; // Matches backend UserController mapping

// ===== Admin Profile =====
export const getAdminProfile = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    throw err;
  }
};

export const updateAdminProfile = async (updatedData, token) => {
  try {
    const res = await axios.put(`${API_URL}/me`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error updating admin profile:", err);
    throw err;
  }
};

// ===== Employee Management =====
export const getAllEmployees = async (token) => {
  try {
    const res = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching employees:", err);
    throw err;
  }
};

export const getEmployeesUnderMe = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/employees-under-me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching employees under admin:", err);
    throw err;
  }
};

export const updateEmployee = async (id, employeeData, token) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(`Error updating employee ${id}:`, err);
    throw err;
  }
};

export const changeEmployeeRole = async (employeeId, role, token) => {
  try {
    const res = await axios.put(
      `${API_URL}/change-role/${employeeId}?role=${role}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error(`Error changing role for employee ${employeeId}:`, err);
    throw err;
  }
};

export const deleteEmployee = async (id, token) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(`Error deleting employee ${id}:`, err);
    throw err;
  }
};

export const assignManager = async (id, managerName, token) => {
  try {
    const res = await axios.put(
      `${API_URL}/${id}/assign-manager?managerName=${encodeURIComponent(managerName)}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error(`Error assigning manager to employee ${id}:`, err);
    throw err;
  }
};
