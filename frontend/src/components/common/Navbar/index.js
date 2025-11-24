import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

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
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      await logout();
      setShowUserMenu(false);
      navigate('/');
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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
            <button className="btn-user" onClick={toggleUserMenu}>
              <span className="user-icon">👤</span>
              <span className="user-name">{currentUser?.namaLengkap || 'User'}</span>
              <span className="dropdown-icon">{showUserMenu ? '▲' : '▼'}</span>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-user-info">
                    <span className="dropdown-name">{currentUser?.namaLengkap}</span>
                    <span className="dropdown-email">{currentUser?.email}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleProfileClick}>
                  <span className="dropdown-icon">👤</span>
                  <span>Profile Saya</span>
                </button>
                {currentUser?.role === 'admin' && (
                  <>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={() => {
                      navigate('/admin');
                      setShowUserMenu(false);
                    }}>
                      <span className="dropdown-icon">⚙️</span>
                      <span>Admin Panel</span>
                    </button>
                    <button className="dropdown-item" onClick={() => {
                      navigate('/');
                      setShowUserMenu(false);
                    }}>
                      <span className="dropdown-icon">🏠</span>
                      <span>Homepage</span>
                    </button>
                  </>
                )}
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
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
