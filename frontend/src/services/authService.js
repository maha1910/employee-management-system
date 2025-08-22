import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Login
// Login
const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("name", response.data.name); // only one name key
    localStorage.setItem("username", response.data.username); // if you need actual username separately
  }

  return response.data;
};


// Register
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

// Get current user details (requires token)
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found in localStorage');
  }

  const response = await axios.get(`${API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};


// Update profile (employee self-update)
const updateProfile = async (data) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/users/me`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Admin role update
const updateRole = async (userId, role) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/users/${userId}/role`,
    { exact_role: role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export default {
  login,
  register,
  getCurrentUser,
  updateProfile,
  updateRole
};
