import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import TicketCard from '../../components/TicketCard';
import './MyTicketPage.css';

function MyTicketPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dummy data tiket yang baru saja di-submit (nanti akan diterima dari BookingPage via routing)
  const [ticket] = useState({
    _id: '1',
    kodePemesanan: 'BRY20241117001',
    status: 'confirmed',
    tanggalPemesanan: '2024-11-17T10:30:00',
    jadwalPergi: {
      _id: 'j1',
      kotaAsal: 'Surabaya',
      kotaTujuan: 'Jakarta',
      tanggalKeberangkatan: '2024-11-20T08:00:00',
      jamKeberangkatan: '08:00',
      jamKedatangan: '16:00',
      harga: 250000,
      kursiTersedia: 30,
      totalKursi: 45,
      armada: 'Executive A'
    },
    jadwalPulang: {
      _id: 'j2',
      kotaAsal: 'Jakarta',
      kotaTujuan: 'Surabaya',
      tanggalKeberangkatan: '2024-11-25T09:00:00',
      jamKeberangkatan: '09:00',
      jamKedatangan: '17:00',
      harga: 250000,
      kursiTersedia: 25,
      totalKursi: 45,
      armada: 'Executive B'
    },
    jumlahPenumpang: 2,
    totalHarga: 1000000,
    namaPenumpang: 'Budi Santoso',
    noHpPenumpang: '081234567890',
    emailPenumpang: 'budi.santoso@email.com'
  });

  // Ambil data booking dari navigation state (jika ada)
  useEffect(() => {
    if (location.state?.bookingData) {
      console.log('Booking data received:', location.state.bookingData);
      // Nanti akan set ticket dari bookingData
    }
  }, [location.state]);

  const handleDownloadTicket = () => {
    // Nanti akan implement download PDF
    console.log('Download ticket:', ticket.kodePemesanan);
    alert('Fitur download e-ticket akan segera tersedia!');
  };

  const handlePrintTicket = () => {
    // Nanti akan implement print
    console.log('Print ticket:', ticket.kodePemesanan);
    window.print();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleViewAllTickets = () => {
    navigate('/profile');
  };

  return (
    <div className="my-ticket-page">
      <Navbar />
      
      <div className="my-ticket-container">
        {/* Success Message */}
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h1>Pemesanan Berhasil!</h1>
          <p>Tiket Anda telah berhasil dipesan. Berikut adalah detail e-ticket Anda.</p>
        </div>

        {/* Action Buttons */}
        <div className="ticket-actions-top">
          <button className="action-btn download-btn" onClick={handleDownloadTicket}>
            📥 Download E-Ticket
          </button>
          <button className="action-btn print-btn" onClick={handlePrintTicket}>
            🖨️ Print Tiket
          </button>
        </div>

        {/* Ticket Display */}
        <div className="ticket-display">
          <TicketCard ticket={ticket} />
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <div className="info-card">
            <h3>📧 E-Ticket Terkirim</h3>
            <p>E-ticket telah dikirim ke email <strong>{ticket.emailPenumpang}</strong></p>
          </div>
          <div className="info-card">
            <h3>📱 Notifikasi WhatsApp</h3>
            <p>Konfirmasi juga dikirim ke nomor <strong>{ticket.noHpPenumpang}</strong></p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button className="nav-btn back-btn" onClick={handleBackToHome}>
            ← Kembali ke Beranda
          </button>
          <button className="nav-btn profile-btn" onClick={handleViewAllTickets}>
            Lihat Semua Tiket →
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MyTicketPage;
