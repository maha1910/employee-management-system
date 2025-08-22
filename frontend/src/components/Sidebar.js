import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // <-- Directly get it here

  const menuItems = role?.toUpperCase() === 'ADMIN'
    ? [
        { label: 'Dashboard', path: '/admin' },
        { label: 'Manage Employees', path: '/admin/manage-employees'},
        { label: 'Assign Tasks', path: '/admin/assign-task' },
        { label: 'View All Tasks', path: '/admin/view-tasks' },
        { label: 'Manage Leaves', path: '/admin/manage-leave' },
      ]
    : [
        { label: 'Dashboard', path: '/employee' },
        { label: 'My Tasks', path: '/employee/view-tasks' },
        { label: 'Request Leave', path: '/employee/submit-leave' },
      ];

  return (
    <div style={{ padding: '2rem', background: '#1e1e2f', color: '#fff', height: '100%' }}>
      <h3>{role} Menu</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item, idx) => (
          <li key={idx} style={{ margin: '1rem 0' }}>
            <button
              onClick={() => navigate(item.path)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
