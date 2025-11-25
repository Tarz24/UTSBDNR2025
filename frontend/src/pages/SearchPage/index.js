import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/common/Navbar"
import Footer from "../../components/common/Footer"
import WhatsAppButton from "../../components/common/WhatsAppButton"
import SearchResultCard from "../../components/search/SearchResultCard"
import "./SearchPage.css"

function SearchPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, loading, addBooking, currentUser } = useAuth()

  // Redirect ke login jika belum login
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      alert("Anda harus login terlebih dahulu untuk mencari jadwal!")
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "Silakan login terlebih dahulu untuk mencari jadwal",
        },
      })
    }
  }, [isLoggedIn, loading, navigate, location.pathname])

  // State untuk menyimpan data pencarian dari HomePage
  const [searchParams, setSearchParams] = useState({
    berangkatDari: "BANDUNG, PASTEUR2",
    tujuanKe: "JAKARTA SELATAN, TEBET",
    tanggalPergi: "2025-11-17",
    penumpang: 1,
  })

  // Ambil data dari navigation state (jika ada)
  useEffect(() => {
    if (location.state?.searchParams) {
      setSearchParams(location.state.searchParams)
    }
  }, [location.state])

  // State untuk jadwal yang dipilih
  const [selectedJadwalPergi, setSelectedJadwalPergi] = useState(null)

  // State untuk jadwal hasil pencarian
  const [jadwalPergi, setJadwalPergi] = useState([])
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true)

  // State untuk modal ubah pencarian
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempSearchParams, setTempSearchParams] = useState({ ...searchParams })
  const [availableLocations, setAvailableLocations] = useState([])

  // Load available locations untuk dropdown dari MongoDB
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"
        const res = await fetch(`${base}/jadwal`)

        if (res.ok) {
          const schedules = await res.json()
          const locations = new Set()
          schedules.forEach(schedule => {
            if (schedule.origin) locations.add(schedule.origin)
            if (schedule.destination) locations.add(schedule.destination)
          })
          setAvailableLocations(Array.from(locations).sort())
        }
      } catch (error) {
        console.error("Error fetching locations:", error)
      }
    }

    fetchLocations()
  }, [])

  // Load jadwal dari MongoDB berdasarkan searchParams
  useEffect(() => {
    if (!isLoggedIn) return

    const fetchSchedules = async () => {
      setIsLoadingSchedules(true)

      try {
        const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"
        const res = await fetch(`${base}/jadwal`)

        if (res.ok) {
          const allSchedules = await res.json()

          // Filter schedules berdasarkan search params
          const filtered = allSchedules.filter(schedule => {
            const matchOrigin = !searchParams.berangkatDari || schedule.origin === searchParams.berangkatDari
            const matchDestination = !searchParams.tujuanKe || schedule.destination === searchParams.tujuanKe
            const matchDate = !searchParams.tanggalPergi || schedule.date === searchParams.tanggalPergi
            const matchStatus = schedule.status === "active"
            const hasSeats = schedule.availableSeats > 0

            return matchOrigin && matchDestination && matchDate && matchStatus && hasSeats
          })

          // Transform data untuk SearchResultCard
          const transformedSchedules = filtered.map(schedule => ({
            id: schedule._id || schedule.id,
            dari: schedule.origin,
            tujuan: schedule.destination,
            pool: schedule.origin.split(", ")[1] || schedule.origin,
            tanggal: new Date(schedule.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            jam: schedule.time,
            kursiTersedia: schedule.availableSeats,
            totalKursi: schedule.seats,
            harga: schedule.price,
            originalData: schedule,
          }))

          setJadwalPergi(transformedSchedules)
        }
      } catch (error) {
        console.error("Error fetching schedules:", error)
      } finally {
        setIsLoadingSchedules(false)
      }
    }

    fetchSchedules()
  }, [searchParams, isLoggedIn])

  // Handler untuk memilih jadwal pergi
  const handleSelectJadwalPergi = jadwal => {
    setSelectedJadwalPergi(jadwal)
  }

  // Handler untuk buka modal ubah pencarian
  const handleOpenModal = () => {
    setTempSearchParams({ ...searchParams })
    setIsModalOpen(true)
  }

  // Handler untuk tutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // Handler untuk ubah pencarian
  const handleUpdateSearch = e => {
    e.preventDefault()
    setSearchParams({ ...tempSearchParams })
    setSelectedJadwalPergi(null)
    setIsModalOpen(false)
  }

  // Handler untuk lanjut ke halaman booking (seat selection)
  const handleLanjutBooking = () => {
    if (!selectedJadwalPergi) {
      alert("Silakan pilih jadwal keberangkatan terlebih dahulu!")
      return
    }

    // Navigate ke SeatSelectionPage dengan data jadwal
    navigate("/seat-selection", {
      state: {
        schedule: selectedJadwalPergi,
        searchParams: searchParams,
      },
    })
  }

  // Hitung total harga
  const calculateTotalPrice = () => {
    if (selectedJadwalPergi) {
      return selectedJadwalPergi.harga * searchParams.penumpang
    }
    return 0
  }

  // Return early jika belum login atau masih loading
  if (loading || !isLoggedIn) {
    return null
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
            </div>
          </div>
          <button className="btn-edit-search" onClick={handleOpenModal}>
            ✏️ Ubah Pencarian
          </button>
        </div>

        <div className="search-content">
          {/* Results Section */}
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title">Jadwal Keberangkatan</h2>
              <p className="results-count">{jadwalPergi.length} jadwal tersedia</p>
            </div>

            <div className="results-list">
              {isLoadingSchedules ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Mencari jadwal tersedia...</p>
                </div>
              ) : jadwalPergi.length > 0 ? (
                jadwalPergi.map(jadwal => <SearchResultCard key={jadwal.id} jadwal={jadwal} onSelect={handleSelectJadwalPergi} isSelected={selectedJadwalPergi?.id === jadwal.id} />)
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">🚌</span>
                  <h3>Tidak ada jadwal tersedia</h3>
                  <p>Maaf, tidak ada jadwal untuk rute dan tanggal yang Anda pilih.</p>
                  <p className="empty-hint">Coba pilih tanggal lain atau ubah rute perjalanan.</p>
                </div>
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
                    <p className="schedule-route">
                      {selectedJadwalPergi.dari} → {selectedJadwalPergi.tujuan}
                    </p>
                    <p className="schedule-time">
                      📅 {selectedJadwalPergi.tanggal} • 🕐 {selectedJadwalPergi.jam}
                    </p>
                    <p className="schedule-price">
                      Rp {selectedJadwalPergi.harga.toLocaleString("id-ID")} x {searchParams.penumpang}
                    </p>
                  </div>
                </div>
              )}

              {/* Total Price */}
              {selectedJadwalPergi && (
                <>
                  <div className="summary-divider"></div>
                  <div className="summary-total">
                    <span className="total-label">Total Pembayaran</span>
                    <span className="total-price">Rp {calculateTotalPrice().toLocaleString("id-ID")}</span>
                  </div>
                </>
              )}

              {/* Action Button */}
              <button className="btn-booking" onClick={handleLanjutBooking} disabled={!selectedJadwalPergi}>
                Lanjut ke Pemesanan
              </button>

              {/* Info */}
              <div className="booking-info">
                <p className="info-text">💡 Pilih jadwal keberangkatan untuk melanjutkan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ubah Pencarian */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Ubah Pencarian</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateSearch} className="modal-form">
              <div className="form-group">
                <label htmlFor="berangkatDari">Berangkat Dari</label>
                <select id="berangkatDari" value={tempSearchParams.berangkatDari} onChange={e => setTempSearchParams({ ...tempSearchParams, berangkatDari: e.target.value })} required>
                  <option value="">Pilih lokasi keberangkatan</option>
                  {availableLocations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tujuanKe">Tujuan Ke</label>
                <select id="tujuanKe" value={tempSearchParams.tujuanKe} onChange={e => setTempSearchParams({ ...tempSearchParams, tujuanKe: e.target.value })} required>
                  <option value="">Pilih tujuan</option>
                  {availableLocations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tanggalPergi">Tanggal Pergi</label>
                <input type="date" id="tanggalPergi" value={tempSearchParams.tanggalPergi} onChange={e => setTempSearchParams({ ...tempSearchParams, tanggalPergi: e.target.value })} min={new Date().toISOString().split("T")[0]} required />
              </div>

              <div className="form-group">
                <label htmlFor="penumpang">Jumlah Penumpang</label>
                <select id="penumpang" value={tempSearchParams.penumpang} onChange={e => setTempSearchParams({ ...tempSearchParams, penumpang: parseInt(e.target.value) })} required>
                  <option value="1">1 Penumpang</option>
                  <option value="2">2 Penumpang</option>
                  <option value="3">3 Penumpang</option>
                  <option value="4">4 Penumpang</option>
                  <option value="5">5 Penumpang</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Batal
                </button>
                <button type="submit" className="btn-submit">
                  Cari Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <WhatsAppButton phoneNumber="6281234567890" text="Tanya Pamela" />
      <Footer />
    </div>
  )
}

export default SearchPage
