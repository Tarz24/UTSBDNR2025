import React, { useState, useEffect } from "react"
import "./SearchForm.css"

function SearchForm({ onSearch }) {
  const [formData, setFormData] = useState({
    berangkatDari: "",
    tujuanKe: "",
    tanggalPergi: "",
    tanggalPulang: "",
    penumpang: 1,
    isPulangPergi: false,
  })

  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  // Load unique locations dari MongoDB API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"
        const res = await fetch(`${base}/jadwal`)

        if (res.ok) {
          const schedules = await res.json()
          const uniqueLocations = new Set()

          schedules.forEach(schedule => {
            if (schedule.origin) uniqueLocations.add(schedule.origin)
            if (schedule.destination) uniqueLocations.add(schedule.destination)
          })

          const sortedLocations = Array.from(uniqueLocations).sort()
          setLocations(sortedLocations)
        }
      } catch (error) {
        console.error("Error fetching locations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    if (onSearch) {
      onSearch(formData)
    }
  }

  return (
    <div className="search-card">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-row">
          {/* Berangkat Dari */}
          <div className="form-group">
            <label>Berangkat Dari</label>
            <div className="input-wrapper">
              <select name="berangkatDari" value={formData.berangkatDari} onChange={handleChange} required>
                <option value="">Pilih Keberangkatan</option>
                {locations.length > 0 ? (
                  locations.map(loc => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Tidak ada lokasi tersedia
                  </option>
                )}
              </select>
            </div>
          </div>

          {/* Tujuan Ke */}
          <div className="form-group">
            <label>Tujuan Ke</label>
            <div className="input-wrapper">
              <select name="tujuanKe" value={formData.tujuanKe} onChange={handleChange} required>
                <option value="">Pilih Tujuan</option>
                {locations.length > 0 ? (
                  locations.map(loc => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Tidak ada lokasi tersedia
                  </option>
                )}
              </select>
            </div>
          </div>

          {/* Tanggal Pergi */}
          <div className="form-group">
            <label>Tanggal Pergi</label>
            <div className="input-wrapper">
              <input type="date" name="tanggalPergi" value={formData.tanggalPergi} onChange={handleChange} required />
            </div>
          </div>

          {/* Penumpang */}
          <div className="form-group">
            <label>Penumpang</label>
            <div className="input-wrapper">
              <select name="penumpang" value={formData.penumpang} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>
                    {num} Orang
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-submit">
          <button type="submit" className="btn-cari-tiket">
            CARI TIKET
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchForm
