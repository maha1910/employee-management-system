import axios from "axios";

const API_URL = "http://localhost:8080/leave-requests";

export const submitLeaveRequest = async (leaveData, token) => {
  try {
    const res = await axios.post(`${API_URL}/submit`, leaveData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error submitting leave request:", err.response?.data || err.message);
    throw err;
  }
};

export const getEmployeeLeaveHistory = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching employee leave history:", err.response?.data || err.message);
    throw err;
  }
};

export const getPendingLeaveRequests = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching pending leave requests:", err.response?.data || err.message);
    throw err;
  }
};

export const approveLeaveRequest = async (id, token) => {
  try {
    const res = await axios.put(`${API_URL}/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(`Error approving leave request ${id}:`, err.response?.data || err.message);
    throw err;
  }
};

export const rejectLeaveRequest = async (id, token) => {
  try {
    const res = await axios.put(`${API_URL}/${id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(`Error rejecting leave request ${id}:`, err.response?.data || err.message);
    throw err;
  }
};