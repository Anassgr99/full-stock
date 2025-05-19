// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    'Dashboard',
    'Products',
    'Orders',
    'Purchases',
    'Quotations',
    'Pages',
    'Settings',
  ];

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        height: '100vh',
        borderRight: '1px solid #dee2e6',
      }}
    >
      {menuItems.map((item) => (
        <div key={item} style={{ marginBottom: '10px' }}>
          <Link to={`/${item.toLowerCase()}`} style={{ textDecoration: 'none', color: '#000' }}>
            {item}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
