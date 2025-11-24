import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import './SeatSelectionPage.css';

function SeatSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, loading } = useAuth();

  // Redirect jika belum login
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      alert('Anda harus login terlebih dahulu!');
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  // Get booking data dari SearchPage
  const [bookingData, setBookingData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats] = useState([3, 7, 12, 15, 18]); // Contoh kursi yang sudah terisi

  useEffect(() => {
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
    } else {
      // Jika tidak ada data, redirect ke search
      navigate('/search');
    }
  }, [location.state, navigate]);

  // Generate kursi (4 baris x 5 kolom = 20 kursi)
  const totalSeats = 20;
  const seatsPerRow = 4;

  const handleSeatClick = (seatNumber) => {
    // Cek apakah kursi sudah terisi
    if (occupiedSeats.includes(seatNumber)) {
      return;
    }

    // Toggle seat selection
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      // Cek apakah sudah mencapai jumlah penumpang
      if (bookingData && selectedSeats.length >= bookingData.seats) {
        alert(`Anda hanya dapat memilih ${bookingData.seats} kursi sesuai jumlah penumpang`);
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const getSeatStatus = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) return 'occupied';
    if (selectedSeats.includes(seatNumber)) return 'selected';
    return 'available';
  };

  const handleContinue = () => {
    if (selectedSeats.length !== bookingData?.seats) {
      alert(`Silakan pilih ${bookingData.seats} kursi sesuai jumlah penumpang`);
      return;
    }

    // Navigate ke MyTicketPage dengan data booking + kursi
    navigate('/my-ticket', {
      state: {
        bookingData: {
          ...bookingData,
          selectedSeats: selectedSeats.sort((a, b) => a - b)
        }
      }
    });
  };

  const handleBack = () => {
    navigate('/search', {
      state: {
        searchParams: location.state?.searchParams
      }
    });
  };

  if (loading || !isLoggedIn || !bookingData) {
    return null;
  }

  return (
    <div className="seat-selection-page">
      <Navbar />

      <div className="seat-selection-container">
        {/* Header */}
        <div className="selection-header">
          <button className="btn-back" onClick={handleBack}>← Kembali</button>
          <h1>Pilih Kursi Anda</h1>
          <div className="selection-step">Langkah 2 dari 3</div>
        </div>

        {/* Booking Info */}
        <div className="booking-info-card">
          <div className="info-row">
            <span className="info-label">Rute:</span>
            <span className="info-value">{bookingData.origin} → {bookingData.destination}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Tanggal:</span>
            <span className="info-value">{bookingData.date} • {bookingData.time}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Penumpang:</span>
            <span className="info-value">{bookingData.seats} orang</span>
          </div>
        </div>

        <div className="seat-content">
          {/* Seat Layout */}
          <div className="seat-layout-section">
            <div className="driver-section">
              <div className="driver-icon">🚗</div>
              <span>Supir</span>
            </div>

            <div className="seats-grid">
              {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seatNumber) => {
                const status = getSeatStatus(seatNumber);
                const isAisle = seatNumber % seatsPerRow === 2; // Lorong setelah kursi ke-2 setiap baris
                
                return (
                  <React.Fragment key={seatNumber}>
                    <button
                      className={`seat ${status}`}
                      onClick={() => handleSeatClick(seatNumber)}
                      disabled={status === 'occupied'}
                    >
                      <div className="seat-number">{seatNumber}</div>
                      <div className="seat-icon">💺</div>
                    </button>
                    {isAisle && <div className="aisle"></div>}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Legend */}
            <div className="seat-legend">
              <div className="legend-item">
                <div className="legend-seat available"></div>
                <span>Tersedia</span>
              </div>
              <div className="legend-item">
                <div className="legend-seat selected"></div>
                <span>Dipilih</span>
              </div>
              <div className="legend-item">
                <div className="legend-seat occupied"></div>
                <span>Terisi</span>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="selection-summary">
            <div className="summary-card">
              <h3>Ringkasan Pemilihan</h3>

              <div className="selected-seats-info">
                <div className="seats-count">
                  <span className="count-label">Kursi Dipilih:</span>
                  <span className="count-value">{selectedSeats.length} / {bookingData.seats}</span>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="seats-list">
                    {selectedSeats.sort((a, b) => a - b).map(seat => (
                      <span key={seat} className="seat-badge">{seat}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="summary-divider"></div>

              <div className="price-info">
                <div className="price-row">
                  <span>Harga per orang</span>
                  <span>Rp {bookingData.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="price-row">
                  <span>Jumlah penumpang</span>
                  <span>× {bookingData.seats}</span>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="total-price">
                <span>Total Pembayaran</span>
                <span className="price">Rp {bookingData.totalPrice.toLocaleString('id-ID')}</span>
              </div>

              <button 
                className="btn-continue" 
                onClick={handleContinue}
                disabled={selectedSeats.length !== bookingData.seats}
              >
                Lanjut ke Pembayaran
              </button>

              <div className="selection-note">
                <p>💡 Pilih {bookingData.seats} kursi sesuai jumlah penumpang Anda</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SeatSelectionPage;
