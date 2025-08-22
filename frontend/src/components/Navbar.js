import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('name') || '');
    setRole(localStorage.getItem('role') || '');
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    
    <nav style={{
      background: '#333',
      color: '#fff',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      
      <div>
        <h2 style={{ margin: 0, paddingLeft: '2rem' }}>EmpConnect</h2>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span>👤 {name} ({role})</span>
        <button onClick={handleLogout} style={{
          background: '#f44336',
          color: '#fff',
          border: 'none',
          padding: '0.5rem 1rem',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
