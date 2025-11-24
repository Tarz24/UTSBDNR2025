import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import TicketCard from '../../components/TicketCard';
import './MyTicketPage.css';

function MyTicketPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUser, loading } = useAuth();

  // State untuk ticket
  const [ticket, setTicket] = useState(null);

  // Redirect ke login jika belum login
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      alert('Anda harus login terlebih dahulu!');
      navigate('/login', { 
        state: { 
          from: location.pathname,
          message: 'Silakan login terlebih dahulu untuk melihat tiket' 
        } 
      });
    }
  }, [isLoggedIn, loading, navigate, location.pathname]);

  // Ambil data booking dari navigation state dan transform untuk TicketCard
  useEffect(() => {
    if (location.state?.bookingData) {
      const bookingData = location.state.bookingData;
      console.log('Booking data received:', bookingData);
      
      // Transform data untuk format yang diharapkan TicketCard
      const transformedTicket = {
        _id: bookingData.id,
        kodePemesanan: bookingData.id,
        status: bookingData.status,
        tanggalPemesanan: bookingData.bookingDate,
        jadwalPergi: {
          _id: bookingData.scheduleId,
          kotaAsal: bookingData.origin,
          kotaTujuan: bookingData.destination,
          tanggalKeberangkatan: `${bookingData.date}T${bookingData.time}:00`,
          jamKeberangkatan: bookingData.time,
          jamKedatangan: '-', // Tidak ada data kedatangan di localStorage
          harga: bookingData.price,
          kursiTersedia: bookingData.jadwalPergi?.kursiTersedia || 0,
          totalKursi: bookingData.jadwalPergi?.totalKursi || 0,
          armada: bookingData.jadwalPergi?.pool || 'Travel'
        },
        jadwalPulang: bookingData.isPulangPergi && bookingData.jadwalPulang ? {
          _id: bookingData.jadwalPulang.id,
          kotaAsal: bookingData.jadwalPulang.dari,
          kotaTujuan: bookingData.jadwalPulang.tujuan,
          tanggalKeberangkatan: bookingData.jadwalPulang.tanggal,
          jamKeberangkatan: bookingData.jadwalPulang.jam,
          jamKedatangan: '-',
          harga: bookingData.jadwalPulang.harga,
          kursiTersedia: bookingData.jadwalPulang.kursiTersedia,
          totalKursi: bookingData.jadwalPulang.totalKursi,
          armada: bookingData.jadwalPulang.pool
        } : null,
        jumlahPenumpang: bookingData.seats,
        selectedSeats: bookingData.selectedSeats || [],
        totalHarga: bookingData.totalPrice,
        namaPenumpang: currentUser?.namaLengkap,
        noHpPenumpang: currentUser?.noHp,
        emailPenumpang: currentUser?.email
      };
      
      setTicket(transformedTicket);
    }
  }, [location.state, currentUser]);

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

  // Return early jika belum login atau masih loading
  if (loading || !isLoggedIn || !ticket) {
    return null;
  }

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
            <p>E-ticket telah dikirim ke email <strong>{currentUser.email}</strong></p>
          </div>
          <div className="info-card">
            <h3>📱 Notifikasi WhatsApp</h3>
            <p>Konfirmasi juga dikirim ke nomor <strong>{currentUser.noHp}</strong></p>
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
