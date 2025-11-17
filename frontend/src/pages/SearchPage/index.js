import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import WhatsAppButton from '../../components/common/WhatsAppButton';
import SearchResultCard from '../../components/search/SearchResultCard';
import './SearchPage.css';

function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Dummy data jadwal (nanti akan diganti dengan API call)
  const jadwalPergi = [
    {
      id: 1,
      dari: 'BANDUNG, PASTEUR2',
      tujuan: 'JAKARTA SELATAN, TEBET',
      pool: 'Pasteur 2',
      tanggal: '17 November 2025',
      jam: '06:00',
      kursiTersedia: 12,
      totalKursi: 20,
      harga: 113000
    },
    {
      id: 2,
      dari: 'BANDUNG, PASTEUR2',
      tujuan: 'JAKARTA SELATAN, TEBET',
      pool: 'Pasteur 2',
      tanggal: '17 November 2025',
      jam: '09:00',
      kursiTersedia: 8,
      totalKursi: 20,
      harga: 113000
    },
    {
      id: 3,
      dari: 'BANDUNG, PASTEUR2',
      tujuan: 'JAKARTA SELATAN, TEBET',
      pool: 'Pasteur 2',
      tanggal: '17 November 2025',
      jam: '12:00',
      kursiTersedia: 15,
      totalKursi: 20,
      harga: 113000
    },
    {
      id: 4,
      dari: 'BANDUNG, PASTEUR2',
      tujuan: 'JAKARTA SELATAN, TEBET',
      pool: 'Pasteur 2',
      tanggal: '17 November 2025',
      jam: '15:00',
      kursiTersedia: 5,
      totalKursi: 20,
      harga: 113000
    }
  ];

  // Jadwal pulang (rute terbalik)
  const jadwalPulang = [
    {
      id: 5,
      dari: 'JAKARTA SELATAN, TEBET',
      tujuan: 'BANDUNG, PASTEUR2',
      pool: 'Tebet',
      tanggal: '20 November 2025',
      jam: '07:00',
      kursiTersedia: 10,
      totalKursi: 20,
      harga: 113000
    },
    {
      id: 6,
      dari: 'JAKARTA SELATAN, TEBET',
      tujuan: 'BANDUNG, PASTEUR2',
      pool: 'Tebet',
      tanggal: '20 November 2025',
      jam: '10:00',
      kursiTersedia: 14,
      totalKursi: 20,
      harga: 113000
    },
    {
      id: 7,
      dari: 'JAKARTA SELATAN, TEBET',
      tujuan: 'BANDUNG, PASTEUR2',
      pool: 'Tebet',
      tanggal: '20 November 2025',
      jam: '14:00',
      kursiTersedia: 6,
      totalKursi: 20,
      harga: 113000
    },
    {
      id: 8,
      dari: 'JAKARTA SELATAN, TEBET',
      tujuan: 'BANDUNG, PASTEUR2',
      pool: 'Tebet',
      tanggal: '20 November 2025',
      jam: '17:00',
      kursiTersedia: 18,
      totalKursi: 20,
      harga: 113000
    }
  ];

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
              {activeTab === 'pergi' ? (
                jadwalPergi.map(jadwal => (
                  <SearchResultCard
                    key={jadwal.id}
                    jadwal={jadwal}
                    onSelect={handleSelectJadwalPergi}
                    isSelected={selectedJadwalPergi?.id === jadwal.id}
                  />
                ))
              ) : (
                jadwalPulang.map(jadwal => (
                  <SearchResultCard
                    key={jadwal.id}
                    jadwal={jadwal}
                    onSelect={handleSelectJadwalPulang}
                    isSelected={selectedJadwalPulang?.id === jadwal.id}
                  />
                ))
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
