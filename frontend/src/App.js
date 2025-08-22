import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Unauthorized from './pages/Unauthorized';

import CompleteProfilePage from './pages/CompleteProfilePage';
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AssignTaskPage from './pages/admin/AssignTaskPage';
import ManageLeaveRequestsPage from './pages/admin/ManageLeaveRequestsPage';
import ViewAllTasksPage from './pages/admin/ViewAllTasksPage';
import ManageEmployees from './pages/admin/ManageEmployees';

// Employee pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import SubmitLeaveRequestPage from './pages/employee/SubmitLeaveRequestPage';
import UpdateTaskStatusPage from './pages/employee/UpdateTaskStatusPage';
import ViewTasksPage from './pages/employee/ViewTasksPage';

// Utilities
import PrivateRoute from './utils/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route path='/complete-profile'
        element={<CompleteProfilePage />}
        />
        <Route
          path="/admin/assign-task"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AssignTaskPage />
            </PrivateRoute>
          }
        />

        <Route path='/admin/manage-employees' element={<ManageEmployees/>} />

        <Route
          path="/admin/manage-leave"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <ManageLeaveRequestsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/view-tasks"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <ViewAllTasksPage />
            </PrivateRoute>
          }
        />

        {/* Employee Protected Routes */}
        <Route
          path="/employee"
          element={
            <PrivateRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/submit-leave"
          element={
            <PrivateRoute allowedRoles={['EMPLOYEE']}>
              <SubmitLeaveRequestPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/update-task/:id"
          element={
            <PrivateRoute allowedRoles={['EMPLOYEE']}>
              <UpdateTaskStatusPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/view-tasks"
          element={
            <PrivateRoute allowedRoles={['EMPLOYEE']}>
              <ViewTasksPage />
            </PrivateRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
