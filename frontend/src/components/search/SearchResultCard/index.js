import React from 'react';
import './SearchResultCard.css';

function SearchResultCard({ jadwal, onSelect, isSelected }) {
  return (
    <div className={`search-result-card ${isSelected ? 'selected' : ''}`}>
      <div className="result-card-header">
        <div className="route-info-main">
          <div className="location-item">
            <span className="location-icon">📍</span>
            <span className="location-name">{jadwal.dari}</span>
          </div>
          <div className="route-arrow">→</div>
          <div className="location-item">
            <span className="location-icon">🎯</span>
            <span className="location-name">{jadwal.tujuan}</span>
          </div>
        </div>
        <div className="pool-info">
          <span className="pool-label">Pool:</span>
          <span className="pool-name">{jadwal.pool}</span>
        </div>
      </div>

      <div className="result-card-body">
        <div className="schedule-info">
          <div className="info-item">
            <span className="info-icon">📅</span>
            <span className="info-label">Tanggal</span>
            <span className="info-value">{jadwal.tanggal}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🕐</span>
            <span className="info-label">Jam Berangkat</span>
            <span className="info-value">{jadwal.jam}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">💺</span>
            <span className="info-label">Kursi Tersedia</span>
            <span className="info-value">{jadwal.kursiTersedia} / {jadwal.totalKursi}</span>
          </div>
        </div>

        <div className="result-card-footer">
          <div className="price-section">
            <span className="price-label">Harga</span>
            <span className="price-value">Rp {jadwal.harga.toLocaleString('id-ID')}</span>
          </div>
          <button 
            className={`btn-select ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(jadwal)}
          >
            {isSelected ? '✓ Terpilih' : 'Pilih Jadwal'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchResultCard;
