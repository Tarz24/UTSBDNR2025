import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
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
          <li><a href="#cek-tiket">CEK TIKET</a></li>
        </ul>

        <button className="btn-masuk">🔒 MASUK</button>
      </div>
    </nav>
  );
}

export default Navbar;
