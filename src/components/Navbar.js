import React, { useState, useEffect } from 'react';
// src/components/Navbar.js

import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaPlusSquare, FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.iconLink} title="Home">
        <FaHome size={24} />
      </Link>
      <Link to="/create" style={styles.iconLink} title="Create Post">
        <FaPlusSquare size={24} />
      </Link>
      <button onClick={handleLogout} style={styles.iconButton} title="Logout">
        <FaSignOutAlt size={24} />
      </button>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    background: '#e3f2fd',
    padding: '12px 24px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  iconLink: {
    color: '#007bff',
    textDecoration: 'none',
    transition: 'transform 0.2s ease',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#007bff',
    transition: 'transform 0.2s ease',
  },
};

export default Navbar;


