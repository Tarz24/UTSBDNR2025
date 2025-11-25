import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import JadwalCard from "../JadwalCard"
import "./JadwalSection.css"

function JadwalSection() {
  const navigate = useNavigate()
  const [jadwalData, setJadwalData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const cardsPerView = 4

  useEffect(() => {
    const fetchTodaySchedules = async () => {
      try {
        const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"
        const today = new Date().toISOString().split("T")[0]

        // Fetch schedules from MongoDB
        const res = await fetch(`${base}/jadwal`)

        if (res.ok) {
          const schedules = await res.json()

          // Filter schedules for min today
          let filteredSchedules = schedules.filter(schedule => schedule.date >= today && schedule.status === "active" && (schedule.availableSeats || schedule.kursi_tersedia) > 0)

          // Transform ALL schedules (no limit)
          const transformedSchedules = filteredSchedules.map(schedule => ({
            id: schedule.id || schedule._id,
            tanggal: new Date(schedule.date).toLocaleDateString("id-ID", { day: "numeric", month: "long" }),
            tahun: new Date(schedule.date).getFullYear().toString(),
            origin: schedule.origin,
            destination: schedule.destination,
            rute: [schedule.origin, schedule.destination],
            harga: schedule.price || schedule.harga,
            diskon: 15,
            date: schedule.date,
            time: schedule.time,
          }))

          setJadwalData(transformedSchedules)
        }
      } catch (error) {
        console.error("Error fetching schedules:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTodaySchedules()
  }, [])

  const handleJadwalClick = jadwal => {
    navigate("/search", {
      state: {
        searchParams: {
          berangkatDari: jadwal.origin,
          tujuanKe: jadwal.destination,
          tanggalPergi: jadwal.date,
          penumpang: 1,
          isPulangPergi: false,
        },
      },
    })
  }

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(jadwalData.length - cardsPerView, prev + 1))
  }

  const visibleSchedules = jadwalData.slice(currentIndex, currentIndex + cardsPerView)

  // Show loading state
  if (loading) {
    return (
      <section className="jadwal-section">
        <div className="jadwal-container">
          <h2 className="section-title">Jadwal Tersedia Hari Ini</h2>
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>Memuat jadwal...</p>
        </div>
      </section>
    )
  }

  // Show message if no schedules available
  if (jadwalData.length === 0) {
    return (
      <section className="jadwal-section">
        <div className="jadwal-container">
          <h2 className="section-title">Jadwal Tersedia Hari Ini</h2>
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>Tidak ada jadwal tersedia untuk hari ini.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="jadwal-section">
      <div className="jadwal-container">
        <h2 className="section-title">Jadwal Tersedia Hari Ini</h2>

        <div className="jadwal-carousel">
          {visibleSchedules.map((jadwal, index) => (
            <JadwalCard key={jadwal.id} tanggal={jadwal.tanggal} tahun={jadwal.tahun} rute={jadwal.rute} harga={jadwal.harga} diskon={jadwal.diskon} onClick={() => handleJadwalClick(jadwal)} />
          ))}
        </div>

        {/* Navigation Arrows - Only show if more than 4 schedules */}
        {jadwalData.length > cardsPerView && (
          <div className="carousel-navigation">
            <button className="carousel-btn prev" onClick={handlePrev} disabled={currentIndex === 0}>
              ❮
            </button>
            <button className="carousel-btn next" onClick={handleNext} disabled={currentIndex >= jadwalData.length - cardsPerView}>
              ❯
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default JadwalSection
