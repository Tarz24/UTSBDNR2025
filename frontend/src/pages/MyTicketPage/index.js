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

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

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

  // Fetch bookings dari MongoDB
  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser?.email) return;

      try {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
        const res = await fetch(`${base}/pemesanan`);
        
        if (res.ok) {
          const allBookings = await res.json();
          
          // Filter bookings milik user yang sedang login
          const userBookings = allBookings.filter(b => 
            b.userEmail === currentUser.email
          );

          // Transform untuk TicketCard
          const transformedTickets = userBookings.map(booking => ({
            _id: booking._id,
            kodePemesanan: booking.id || booking._id,
            status: booking.status,
            tanggalPemesanan: booking.bookingDate,
            jadwalPergi: {
              _id: booking.scheduleId,
              kotaAsal: booking.origin,
              kotaTujuan: booking.destination,
              tanggalKeberangkatan: `${booking.date}T${booking.time}:00`,
              jamKeberangkatan: booking.time,
              jamKedatangan: '-',
              harga: booking.price,
              kursiTersedia: 0,
              totalKursi: 20,
              armada: 'Travel'
            },
            jadwalPulang: null,
            jumlahPenumpang: booking.seats,
            nomorKursi: booking.nomor_kursi,
            totalHarga: booking.totalPrice,
            namaPenumpang: booking.userName,
            noHpPenumpang: booking.userPhone,
            emailPenumpang: booking.userEmail
          }));

          setTickets(transformedTickets);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoadingTickets(false);
      }
    };

    if (isLoggedIn && currentUser) {
      fetchBookings();
    }
  }, [isLoggedIn, currentUser]);

  // Return early jika belum login atau masih loading
  if (loading || !isLoggedIn) {
    return null;
  }

  if (loadingTickets) {
    return (
      <div className="my-ticket-page">
        <Navbar />
        <div className="my-ticket-container">
          <p style={{ textAlign: 'center', padding: '2rem' }}>Memuat tiket...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="my-ticket-page">
        <Navbar />
        <div className="my-ticket-container">
          <div className="empty-state">
            <h2>Belum Ada Tiket</h2>
            <p>Anda belum memiliki pemesanan tiket.</p>
            <button className="nav-btn back-btn" onClick={() => navigate('/')}>
              ← Cari Tiket
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-ticket-page">
      <Navbar />
      
      <div className="my-ticket-container">
        <h1>Tiket Saya</h1>
        <p className="subtitle">Total {tickets.length} tiket</p>

        {/* Ticket List */}
        <div className="tickets-list">
          {tickets.map(ticket => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button className="nav-btn back-btn" onClick={() => navigate('/')}>
            ← Kembali ke Beranda
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MyTicketPage;
