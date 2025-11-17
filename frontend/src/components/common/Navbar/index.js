import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  
  // Dummy state untuk cek apakah user sudah login
  // Nanti akan diganti dengan AuthContext
  const [isLoggedIn] = useState(false);
  const [userName] = useState('Budi Santoso');

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleMyTicketsClick = () => {
    navigate('/profile'); // Redirect ke profile untuk lihat semua tiket
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">🚌</div>
          <div className="logo-text">
            <span className="logo-baraya">BARAYA</span>
            <span className="logo-travel">TRAVEL</span>
          </div>
        </div>
        
        <ul className="navbar-menu">
          <li><a href="#outlet">OUTLET</a></li>
          <li><a href="#layanan">LAYANAN</a></li>
          <li><a href="#cara-bayar">CARA BAYAR</a></li>
          <li><a href="#kontak">KONTAK</a></li>
          <li><a href="#karir">KARIR</a></li>
          <li><a href="#kerjasama">KERJASAMA</a></li>
          <li><a onClick={handleMyTicketsClick} style={{ cursor: 'pointer' }}>CEK TIKET</a></li>
        </ul>

        {isLoggedIn ? (
          <div className="user-menu">
            <button className="btn-user" onClick={handleProfileClick}>
              👤 {userName}
            </button>
          </div>
        ) : (
          <button className="btn-masuk" onClick={handleLoginClick}>
            🔒 MASUK
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
