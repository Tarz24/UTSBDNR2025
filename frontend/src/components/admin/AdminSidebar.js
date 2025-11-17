import React from 'react';
import './AdminSidebar.css';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊'
    },
    {
      id: 'schedules',
      label: 'Jadwal Keberangkatan',
      icon: '📅'
    },
    {
      id: 'bookings',
      label: 'Pemesanan',
      icon: '🎫'
    }
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>🚌 Baraya Travel</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-sidebar-btn" onClick={onLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
