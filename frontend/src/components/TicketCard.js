import React, { useState } from 'react';
import './TicketCard.css';

function TicketCard({ ticket }) {
  const [showDetail, setShowDetail] = useState(false);

  // Format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  // Format waktu
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  // Format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { text: 'Dikonfirmasi', className: 'confirmed' },
      cancelled: { text: 'Dibatalkan', className: 'cancelled' },
      completed: { text: 'Selesai', className: 'completed' }
    };
    
    const config = statusConfig[status] || { text: status, className: 'default' };
    return <span className={`status-badge ${config.className}`}>{config.text}</span>;
  };

  return (
    <div className="ticket-card">
      {/* Header */}
      <div className="ticket-card-header">
        <div className="ticket-info">
          <h3 className="ticket-code">Kode Booking: {ticket.kodePemesanan}</h3>
          <p className="ticket-date">Dipesan pada: {formatDate(ticket.tanggalPemesanan)}</p>
        </div>
        {getStatusBadge(ticket.status)}
      </div>

      {/* Jadwal Pergi */}
      <div className="ticket-journey">
        <div className="journey-label">
          <span className="journey-icon">✈️</span>
          <span className="journey-text">Keberangkatan</span>
        </div>
        
        <div className="journey-details">
          <div className="journey-route">
            <div className="route-point">
              <div className="route-city">{ticket.jadwalPergi.kotaAsal}</div>
              <div className="route-time">{ticket.jadwalPergi.jamKeberangkatan}</div>
            </div>
            <div className="route-line">
              <div className="route-arrow">→</div>
            </div>
            <div className="route-point">
              <div className="route-city">{ticket.jadwalPergi.kotaTujuan}</div>
              <div className="route-time">{ticket.jadwalPergi.jamKedatangan}</div>
            </div>
          </div>
          
          <div className="journey-info">
            <div className="info-item">
              <span className="info-label">📅 Tanggal:</span>
              <span className="info-value">{formatDate(ticket.jadwalPergi.tanggalKeberangkatan)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">🚌 Armada:</span>
              <span className="info-value">{ticket.jadwalPergi.armada}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Jadwal Pulang (jika ada) */}
      {ticket.jadwalPulang && (
        <div className="ticket-journey return-journey">
          <div className="journey-label">
            <span className="journey-icon">🔄</span>
            <span className="journey-text">Kepulangan</span>
          </div>
          
          <div className="journey-details">
            <div className="journey-route">
              <div className="route-point">
                <div className="route-city">{ticket.jadwalPulang.kotaAsal}</div>
                <div className="route-time">{ticket.jadwalPulang.jamKeberangkatan}</div>
              </div>
              <div className="route-line">
                <div className="route-arrow">→</div>
              </div>
              <div className="route-point">
                <div className="route-city">{ticket.jadwalPulang.kotaTujuan}</div>
                <div className="route-time">{ticket.jadwalPulang.jamKedatangan}</div>
              </div>
            </div>
            
            <div className="journey-info">
              <div className="info-item">
                <span className="info-label">📅 Tanggal:</span>
                <span className="info-value">{formatDate(ticket.jadwalPulang.tanggalKeberangkatan)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">🚌 Armada:</span>
                <span className="info-value">{ticket.jadwalPulang.armada}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Passenger & Price Info */}
      <div className="ticket-summary">
        <div className="summary-item">
          <span className="summary-label">👥 Jumlah Penumpang:</span>
          <span className="summary-value">{ticket.jumlahPenumpang} orang</span>
        </div>
        {ticket.selectedSeats && ticket.selectedSeats.length > 0 && (
          <div className="summary-item">
            <span className="summary-label">💺 Nomor Kursi:</span>
            <span className="summary-value">{ticket.selectedSeats.join(', ')}</span>
          </div>
        )}
        <div className="summary-item total-price">
          <span className="summary-label">💰 Total Harga:</span>
          <span className="summary-value">{formatPrice(ticket.totalHarga)}</span>
        </div>
      </div>

      {/* Detail Toggle */}
      <div className="ticket-actions">
        <button 
          className="detail-toggle-btn"
          onClick={() => setShowDetail(!showDetail)}
        >
          {showDetail ? '▲ Sembunyikan Detail' : '▼ Lihat Detail Lengkap'}
        </button>
      </div>

      {/* Detail Penumpang (collapsed) */}
      {showDetail && (
        <div className="ticket-detail">
          <div className="detail-section">
            <h4 className="detail-title">📋 Informasi Penumpang</h4>
            <div className="detail-content">
              <div className="detail-item">
                <span className="detail-label">Nama:</span>
                <span className="detail-value">{ticket.namaPenumpang}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">No. HP:</span>
                <span className="detail-value">{ticket.noHpPenumpang}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{ticket.emailPenumpang}</span>
              </div>
            </div>
          </div>

          {ticket.status === 'confirmed' && (
            <div className="ticket-notice">
              <strong>⚠️ Catatan Penting:</strong>
              <ul>
                <li>Harap datang 30 menit sebelum keberangkatan</li>
                <li>Bawa KTP/identitas asli untuk verifikasi</li>
                <li>Simpan kode booking untuk check-in</li>
                <li>Hubungi customer service untuk perubahan atau pembatalan</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TicketCard;
