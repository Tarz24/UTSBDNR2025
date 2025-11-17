import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section 1: Logo & Social Media */}
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <div className="logo-icon">🚌</div>
            <div className="logo-text">
              <span className="logo-baraya">BARAYA</span>
              <span className="logo-travel">TRAVEL</span>
            </div>
            <span className="logo-anniversary">20 BARAYA</span>
          </div>
          
          <div className="footer-social">
            <h4>FOLLOW US ON</h4>
            <div className="social-icons">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                📷
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                🎵
              </a>
            </div>
          </div>
        </div>

        {/* Section 2: Baraya Travel */}
        <div className="footer-section">
          <h3 className="footer-title">BARAYA TRAVEL</h3>
          <ul className="footer-links">
            <li><a href="#tentang">Tentang</a></li>
            <li><a href="#outlet">Outlet</a></li>
            <li><a href="#kerjasama">Kerjasama</a></li>
            <li><a href="#karir">Karir</a></li>
            <li><a href="#kontak">Kontak</a></li>
          </ul>
        </div>

        {/* Section 3: Layanan */}
        <div className="footer-section">
          <h3 className="footer-title">LAYANAN</h3>
          <ul className="footer-links">
            <li><a href="#baraya-travel">Baraya Travel</a></li>
            <li><a href="#baraya-paket">Baraya Paket</a></li>
            <li><a href="#baraya-kargo">Baraya Kargo</a></li>
            <li><a href="#baraya-pariwisata">Baraya Pariwisata</a></li>
          </ul>
        </div>

        {/* Section 4: Lainnya */}
        <div className="footer-section">
          <h3 className="footer-title">LAINNYA</h3>
          <ul className="footer-links">
            <li><a href="#blog">Blog</a></li>
            <li><a href="#cek-tiket">Cek Tiket</a></li>
            <li><a href="#pilih-pembayaran">Pilih Pembayaran</a></li>
          </ul>
        </div>

        {/* Section 5: Hubungi Kami */}
        <div className="footer-section">
          <h3 className="footer-title">HUBUNGI KAMI</h3>
          <div className="footer-contact">
            <a href="tel:02172449999" className="contact-btn call-btn">
              📞 CALL CENTER
            </a>
            <p className="contact-number">(021) 724 4999</p>
            
            <a href="https://wa.me/6287783801999" className="contact-btn whatsapp-btn">
              💬 WHATSAPP
            </a>
            <p className="contact-number">0877-8380-1999</p>
          </div>
        </div>

        {/* Section 6: Unduh Aplikasi */}
        <div className="footer-section">
          <h3 className="footer-title">UNDUH APLIKASI</h3>
          <div className="footer-apps">
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="app-link">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
            </a>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="app-link">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© 2025 BARAYA TRAVEL - PT. NUR RACHMADI BERSAMA. ALL RIGHTS RESERVED</p>
        <p>EMAIL: <a href="mailto:INFO@NRB-BARAYA.COM">INFO@NRB-BARAYA.COM</a></p>
      </div>
    </footer>
  );
}

export default Footer;
