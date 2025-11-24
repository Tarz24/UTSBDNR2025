import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { addBooking, ensureUserInMongoDB } from "../../utils/dataManager"
import Navbar from "../../components/common/Navbar"
import Footer from "../../components/common/Footer"
import "./SeatSelectionPage.css"

function SeatSelectionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, isLoggedIn } = useAuth()

  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(false)

  // Get schedule and booking data from navigation state
  const { schedule, searchParams } = location.state || {}

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login")
      return
    }

    if (!schedule || !searchParams) {
      alert("Data tidak lengkap!")
      navigate("/search")
    }
  }, [isLoggedIn, schedule, searchParams, navigate])

  // Generate seat layout (20 seats: 4 rows x 5 columns)
  const totalSeats = schedule?.originalData?.seats || 20
  const availableSeats = schedule?.originalData?.availableSeats || 20
  const bookedSeatsCount = totalSeats - availableSeats

  // Create seat array
  const seats = Array.from({ length: totalSeats }, (_, i) => {
    const row = String.fromCharCode(65 + Math.floor(i / 5)) // A, B, C, D
    const col = (i % 5) + 1 // 1, 2, 3, 4, 5
    const seatNumber = `${row}${col}`

    // First bookedSeatsCount seats are booked
    const isBooked = i < bookedSeatsCount

    return {
      number: seatNumber,
      isBooked,
      isSelected: false,
    }
  })

  const handleSeatClick = seatNumber => {
    const seat = seats.find(s => s.number === seatNumber)
    if (seat.isBooked) return

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber))
    } else {
      if (selectedSeats.length >= searchParams.penumpang) {
        alert(`Anda hanya bisa memilih ${searchParams.penumpang} kursi sesuai jumlah penumpang!`)
        return
      }
      setSelectedSeats([...selectedSeats, seatNumber])
    }
  }

  // Generate custom booking ID (BK + 3 random digits)
  const generateBookingId = () => {
    const randomNum = Math.floor(Math.random() * 900) + 100 // 100-999
    return `BK${randomNum}`
  }

  const handleConfirmBooking = async () => {
    if (selectedSeats.length !== searchParams.penumpang) {
      alert(`Harap pilih ${searchParams.penumpang} kursi!`)
      return
    }

    setLoading(true)

    try {
      // Ensure user exists in MongoDB
      const userResult = await ensureUserInMongoDB(currentUser)

      if (!userResult.success) {
        alert(`Gagal memastikan user di database: ${userResult.message}`)
        setLoading(false)
        return
      }

      // Create booking payload with custom ID
      const bookingPayload = {
        id: generateBookingId(), // Custom 5-character ID (BK + 3 digits)
        user: userResult.userId, // MongoDB ObjectId
        jadwal: schedule.originalData._id || schedule.id, // MongoDB ObjectId
        seats: searchParams.penumpang,
        nomor_kursi: selectedSeats,
        totalPrice: schedule.harga * searchParams.penumpang,
      }

      // Submit booking to MongoDB
      const result = await addBooking(bookingPayload)

      if (result.success) {
        alert("Booking berhasil dibuat!")
        navigate("/my-ticket")
      } else {
        alert(result.message || "Gagal membuat booking!")
      }
    } catch (error) {
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!schedule || !searchParams) {
    return null
  }

  const totalPrice = schedule.harga * searchParams.penumpang

  return (
    <div className="seat-selection-page">
      <Navbar />

      <div className="seat-container">
        <div className="seat-content">
          {/* Schedule Info */}
          <div className="schedule-info">
            <h2>Detail Perjalanan</h2>
            <div className="info-card">
              <div className="info-row">
                <span className="label">Dari:</span>
                <span className="value">{schedule.dari}</span>
              </div>
              <div className="info-row">
                <span className="label">Tujuan:</span>
                <span className="value">{schedule.tujuan}</span>
              </div>
              <div className="info-row">
                <span className="label">Tanggal:</span>
                <span className="value">{schedule.tanggal}</span>
              </div>
              <div className="info-row">
                <span className="label">Jam:</span>
                <span className="value">{schedule.jam}</span>
              </div>
              <div className="info-row">
                <span className="label">Penumpang:</span>
                <span className="value">{searchParams.penumpang} orang</span>
              </div>
            </div>
          </div>

          {/* Seat Selection */}
          <div className="seat-selection">
            <h2>Pilih Kursi</h2>
            <div className="seat-legend">
              <div className="legend-item">
                <div className="seat-box available"></div>
                <span>Tersedia</span>
              </div>
              <div className="legend-item">
                <div className="seat-box selected"></div>
                <span>Dipilih</span>
              </div>
              <div className="legend-item">
                <div className="seat-box booked"></div>
                <span>Terisi</span>
              </div>
            </div>

            <div className="bus-layout">
              <div className="driver-seat">Supir</div>
              <div className="seats-grid">
                {seats.map(seat => (
                  <div key={seat.number} className={`seat ${seat.isBooked ? "booked" : ""} ${selectedSeats.includes(seat.number) ? "selected" : ""}`} onClick={() => handleSeatClick(seat.number)}>
                    {seat.number}
                  </div>
                ))}
              </div>
            </div>

            <div className="selected-seats-info">
              <p>
                Kursi Dipilih: <strong>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "Belum ada"}</strong>
              </p>
              <p>
                Sisa kursi yang harus dipilih: <strong>{searchParams.penumpang - selectedSeats.length}</strong>
              </p>
            </div>
          </div>

          {/* Price Summary */}
          <div className="price-summary">
            <div className="summary-card">
              <h3>Ringkasan Pembayaran</h3>
              <div className="price-row">
                <span>Harga per kursi:</span>
                <span>Rp {schedule.harga.toLocaleString("id-ID")}</span>
              </div>
              <div className="price-row">
                <span>Jumlah penumpang:</span>
                <span>{searchParams.penumpang} orang</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
              <button className="btn-confirm" onClick={handleConfirmBooking} disabled={selectedSeats.length !== searchParams.penumpang || loading}>
                {loading ? "Memproses..." : "Konfirmasi Booking"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SeatSelectionPage
