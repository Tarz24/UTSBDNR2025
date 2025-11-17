import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { searchSchedules } from '../../utils/dataManager';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import WhatsAppButton from '../../components/common/WhatsAppButton';
import SearchResultCard from '../../components/search/SearchResultCard';
import './SearchPage.css';

function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, loading } = useAuth();

  // Redirect ke login jika belum login
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      alert('Anda harus login terlebih dahulu untuk mencari jadwal!');
      navigate('/login', { 
        state: { 
          from: location.pathname,
          message: 'Silakan login terlebih dahulu untuk mencari jadwal' 
        } 
      });
    }
  }, [isLoggedIn, loading, navigate, location.pathname]);

  // State untuk menyimpan data pencarian dari HomePage
  const [searchParams, setSearchParams] = useState({
    berangkatDari: 'BANDUNG, PASTEUR2',
    tujuanKe: 'JAKARTA SELATAN, TEBET',
    tanggalPergi: '2025-11-17',
    tanggalPulang: '',
    penumpang: 1,
    isPulangPergi: false
  });

  // Ambil data dari navigation state (jika ada)
  useEffect(() => {
    if (location.state?.searchParams) {
      setSearchParams(location.state.searchParams);
    }
  }, [location.state]);

  // State untuk jadwal yang dipilih
  const [selectedJadwalPergi, setSelectedJadwalPergi] = useState(null);
  const [selectedJadwalPulang, setSelectedJadwalPulang] = useState(null);

  // State untuk tab aktif (pergi/pulang)
  const [activeTab, setActiveTab] = useState('pergi');

  // State untuk jadwal hasil pencarian
  const [jadwalPergi, setJadwalPergi] = useState([]);
  const [jadwalPulang, setJadwalPulang] = useState([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);

  // Load jadwal dari localStorage berdasarkan searchParams
  useEffect(() => {
    if (!isLoggedIn) return;

    setIsLoadingSchedules(true);

    // Helper function untuk transform data ke format yang dibutuhkan SearchResultCard
    const transformScheduleData = (schedule) => {
      // Extract pool name dari origin (e.g., "BANDUNG, PASTEUR2" -> "Pasteur 2")
      const getPoolName = (location) => {
        const parts = location.split(', ');
        return parts.length > 1 ? parts[1] : parts[0];
      };

      // Format date (YYYY-MM-DD -> DD Month YYYY)
      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
      };

      return {
        id: schedule.id,
        dari: schedule.origin,
        tujuan: schedule.destination,
        pool: getPoolName(schedule.origin),
        tanggal: formatDate(schedule.date),
        jam: schedule.time,
        kursiTersedia: schedule.availableSeats,
        totalKursi: schedule.seats,
        harga: schedule.price,
        // Keep original data for booking
        originalData: schedule
      };
    };

    // Cari jadwal keberangkatan
    const resultsPergi = searchSchedules(
      searchParams.berangkatDari,
      searchParams.tujuanKe,
      searchParams.tanggalPergi
    );
    setJadwalPergi(resultsPergi.map(transformScheduleData));

    // Cari jadwal kepulangan (jika pulang pergi)
    if (searchParams.isPulangPergi && searchParams.tanggalPulang) {
      const resultsPulang = searchSchedules(
        searchParams.tujuanKe, // Rute terbalik
        searchParams.berangkatDari,
        searchParams.tanggalPulang
      );
      setJadwalPulang(resultsPulang.map(transformScheduleData));
    } else {
      setJadwalPulang([]);
    }

    setIsLoadingSchedules(false);
  }, [searchParams, isLoggedIn]);

  // Handler untuk memilih jadwal pergi
  const handleSelectJadwalPergi = (jadwal) => {
    setSelectedJadwalPergi(jadwal);
    // Jika pulang pergi, pindah ke tab pulang
    if (searchParams.isPulangPergi) {
      setActiveTab('pulang');
    }
  };

  // Handler untuk memilih jadwal pulang
  const handleSelectJadwalPulang = (jadwal) => {
    setSelectedJadwalPulang(jadwal);
  };

  // Handler untuk lanjut ke halaman booking
  const handleLanjutBooking = () => {
    if (!selectedJadwalPergi) {
      alert('Silakan pilih jadwal keberangkatan terlebih dahulu!');
      return;
    }

    if (searchParams.isPulangPergi && !selectedJadwalPulang) {
      alert('Silakan pilih jadwal kepulangan terlebih dahulu!');
      return;
    }

    console.log('Lanjut ke booking:', {
      jadwalPergi: selectedJadwalPergi,
      jadwalPulang: selectedJadwalPulang,
      penumpang: searchParams.penumpang
    });

    // Navigate ke MyTicketPage dengan data booking
    navigate('/my-ticket', {
      state: {
        bookingData: {
          jadwalPergi: selectedJadwalPergi,
          jadwalPulang: selectedJadwalPulang,
          penumpang: searchParams.penumpang,
          totalHarga: calculateTotalPrice()
        }
      }
    });
  };

  // Hitung total harga
  const calculateTotalPrice = () => {
    let total = 0;
    if (selectedJadwalPergi) {
      total += selectedJadwalPergi.harga * searchParams.penumpang;
    }
    if (searchParams.isPulangPergi && selectedJadwalPulang) {
      total += selectedJadwalPulang.harga * searchParams.penumpang;
    }
    return total;
  };

  // Return early jika belum login atau masih loading
  if (loading || !isLoggedIn) {
    return null;
  }

  return (
    <div className="search-page">
      <Navbar />

      <div className="search-container">
        {/* Search Summary */}
        <div className="search-summary">
          <div className="summary-content">
            <div className="summary-route">
              <span className="route-from">{searchParams.berangkatDari}</span>
              <span className="route-arrow">→</span>
              <span className="route-to">{searchParams.tujuanKe}</span>
            </div>
            <div className="summary-details">
              <span className="detail-item">📅 {searchParams.tanggalPergi}</span>
              <span className="detail-separator">•</span>
              <span className="detail-item">👥 {searchParams.penumpang} Penumpang</span>
              {searchParams.isPulangPergi && (
                <>
                  <span className="detail-separator">•</span>
                  <span className="detail-item">↔️ Pulang Pergi</span>
                </>
              )}
            </div>
          </div>
          <button className="btn-edit-search">✏️ Ubah Pencarian</button>
        </div>

        {/* Tab Navigation - Hanya tampil jika pulang pergi */}
        {searchParams.isPulangPergi && (
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'pergi' ? 'active' : ''} ${selectedJadwalPergi ? 'completed' : ''}`}
              onClick={() => setActiveTab('pergi')}
            >
              <span className="tab-icon">✈️</span>
              <span className="tab-label">Jadwal Berangkat</span>
              {selectedJadwalPergi && <span className="check-icon">✓</span>}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'pulang' ? 'active' : ''} ${selectedJadwalPulang ? 'completed' : ''}`}
              onClick={() => setActiveTab('pulang')}
              disabled={!selectedJadwalPergi}
            >
              <span className="tab-icon">🏠</span>
              <span className="tab-label">Jadwal Pulang</span>
              {selectedJadwalPulang && <span className="check-icon">✓</span>}
            </button>
          </div>
        )}

        <div className="search-content">
          {/* Results Section */}
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title">
                {activeTab === 'pergi' ? 'Jadwal Keberangkatan' : 'Jadwal Kepulangan'}
              </h2>
              <p className="results-count">
                {activeTab === 'pergi' ? jadwalPergi.length : jadwalPulang.length} jadwal tersedia
              </p>
            </div>

            <div className="results-list">
              {isLoadingSchedules ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Mencari jadwal tersedia...</p>
                </div>
              ) : activeTab === 'pergi' ? (
                jadwalPergi.length > 0 ? (
                  jadwalPergi.map(jadwal => (
                    <SearchResultCard
                      key={jadwal.id}
                      jadwal={jadwal}
                      onSelect={handleSelectJadwalPergi}
                      isSelected={selectedJadwalPergi?.id === jadwal.id}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <span className="empty-icon">🚌</span>
                    <h3>Tidak ada jadwal tersedia</h3>
                    <p>Maaf, tidak ada jadwal untuk rute dan tanggal yang Anda pilih.</p>
                    <p className="empty-hint">Coba pilih tanggal lain atau ubah rute perjalanan.</p>
                  </div>
                )
              ) : (
                jadwalPulang.length > 0 ? (
                  jadwalPulang.map(jadwal => (
                    <SearchResultCard
                      key={jadwal.id}
                      jadwal={jadwal}
                      onSelect={handleSelectJadwalPulang}
                      isSelected={selectedJadwalPulang?.id === jadwal.id}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <span className="empty-icon">🚌</span>
                    <h3>Tidak ada jadwal tersedia</h3>
                    <p>Maaf, tidak ada jadwal pulang untuk rute dan tanggal yang Anda pilih.</p>
                    <p className="empty-hint">Coba pilih tanggal lain atau ubah rute perjalanan.</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="booking-summary">
            <div className="summary-card">
              <h3 className="summary-title">Ringkasan Pemesanan</h3>

              {/* Jadwal Pergi */}
              {selectedJadwalPergi && (
                <div className="selected-schedule">
                  <div className="schedule-header">
                    <span className="schedule-type">✈️ Keberangkatan</span>
                  </div>
                  <div className="schedule-details">
                    <p className="schedule-route">{selectedJadwalPergi.dari} → {selectedJadwalPergi.tujuan}</p>
                    <p className="schedule-time">📅 {selectedJadwalPergi.tanggal} • 🕐 {selectedJadwalPergi.jam}</p>
                    <p className="schedule-price">Rp {selectedJadwalPergi.harga.toLocaleString('id-ID')} x {searchParams.penumpang}</p>
                  </div>
                </div>
              )}

              {/* Jadwal Pulang */}
              {searchParams.isPulangPergi && selectedJadwalPulang && (
                <div className="selected-schedule">
                  <div className="schedule-header">
                    <span className="schedule-type">🏠 Kepulangan</span>
                  </div>
                  <div className="schedule-details">
                    <p className="schedule-route">{selectedJadwalPulang.dari} → {selectedJadwalPulang.tujuan}</p>
                    <p className="schedule-time">📅 {selectedJadwalPulang.tanggal} • 🕐 {selectedJadwalPulang.jam}</p>
                    <p className="schedule-price">Rp {selectedJadwalPulang.harga.toLocaleString('id-ID')} x {searchParams.penumpang}</p>
                  </div>
                </div>
              )}

              {/* Total Price */}
              {(selectedJadwalPergi || selectedJadwalPulang) && (
                <>
                  <div className="summary-divider"></div>
                  <div className="summary-total">
                    <span className="total-label">Total Pembayaran</span>
                    <span className="total-price">Rp {calculateTotalPrice().toLocaleString('id-ID')}</span>
                  </div>
                </>
              )}

              {/* Action Button */}
              <button 
                className="btn-booking" 
                onClick={handleLanjutBooking}
                disabled={!selectedJadwalPergi || (searchParams.isPulangPergi && !selectedJadwalPulang)}
              >
                Lanjut ke Pemesanan
              </button>

              {/* Info */}
              <div className="booking-info">
                <p className="info-text">💡 Pilih jadwal keberangkatan{searchParams.isPulangPergi ? ' dan kepulangan' : ''} untuk melanjutkan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton phoneNumber="6281234567890" text="Tanya Pamela" />
      <Footer />
    </div>
  );
}

export default SearchPage;
