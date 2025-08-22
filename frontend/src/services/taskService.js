import axios from "axios";

const API_URL = "http://localhost:8080/tasks";

// ✅ Admin: Assign a new task to an employee
export const assignTask = async (taskData, token) => {
  try {
    const res = await axios.post(`${API_URL}/assign`, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error assigning task:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Employee: Get all tasks assigned to the current user
export const getMyTasks = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching user tasks:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Admin: Get all tasks in the system
export const getAllTasks = async (token) => {
  try {
    const res = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching all tasks:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Employee: Update the status of a specific task
export const updateTaskStatus = async (taskId, status, token) => {
  try {
    const res = await axios.put(
      `${API_URL}/${taskId}/status`,
      { status: status }, // 🟢 Backend expects a JSON body with the status
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error(`Error updating task status for task ${taskId}:`, err.response?.data || err.message);
    throw err;
  }
};