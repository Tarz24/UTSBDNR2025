import React from 'react';
import './JadwalCard.css';

function JadwalCard({ tanggal, tahun, rute, harga, diskon }) {
  return (
    <div className="jadwal-card">
      <div className="jadwal-header">
        <div className="jadwal-date">
          <div className="date-day">{tanggal}</div>
          <div className="date-year">{tahun}</div>
        </div>
        <button className="btn-pulang-pergi">↔️ Pulang Pergi</button>
      </div>
      <div className="jadwal-body">
        <div className="route-info">
          {rute.map((route, index) => (
            <div key={index} className="route-item">• {route}</div>
          ))}
        </div>
        <div className="price-info">
          <span className="price-label">Rp {harga.toLocaleString('id-ID')}</span>
          <span className="discount-badge">{diskon}%</span>
        </div>
      </div>
    </div>
  );
}

export default JadwalCard;
