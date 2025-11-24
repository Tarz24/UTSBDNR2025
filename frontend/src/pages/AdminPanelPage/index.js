import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { fetchAllSchedules, getAllBookings, addSchedule, updateSchedule, deleteSchedule, updateBookingStatus, getAllUsers } from "../../utils/dataManager"
import AdminSidebar from "../../components/admin/AdminSidebar"
import StatCard from "../../components/admin/StatCard"
import BookingChart from "../../components/admin/BookingChart"
import "./AdminPanelPage.css"

const AdminPanelPage = () => {
  const navigate = useNavigate()
  const { isLoggedIn, currentUser, loading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false)
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [showAdminMenu, setShowAdminMenu] = useState(false)

  // State untuk data dari localStorage
  const [schedules, setSchedules] = useState([])
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({
    totalSchedules: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  })

  // Check admin role dan redirect jika bukan admin
  useEffect(() => {
    if (!loading && (!isLoggedIn || currentUser?.role !== "admin")) {
      alert("Anda tidak memiliki akses ke halaman ini!")
      navigate("/")
    }
  }, [isLoggedIn, currentUser, loading, navigate])

  // Load data dari localStorage
  useEffect(() => {
    if (isLoggedIn && currentUser?.role === "admin") {
      loadData()
    }
  }, [isLoggedIn, currentUser])

  const loadData = async () => {
    // Load schedules from backend API (falls back to empty array on error)
    const schedulesData = await fetchAllSchedules()
    setSchedules(schedulesData || [])
    // load users (try API first, then fallback)
    try {
      const u = await getAllUsers()
      setUsers(u || [])
    } catch (e) {
      setUsers([])
    }

    // Load bookings from API (dataManager.getAllBookings is async now)
    const bookingsData = await getAllBookings()
    setBookings(bookingsData)

    // Calculate statistics
    const totalRevenue = bookingsData.filter(b => b.status === "confirmed" || b.status === "completed").reduce((sum, b) => sum + (b.totalPrice || 0), 0)

    const pendingCount = bookingsData.filter(b => b.status === "pending").length

    setStats({
      totalSchedules: schedulesData.length,
      totalBookings: bookingsData.length,
      totalRevenue: totalRevenue,
      pendingBookings: pendingCount,
    })
  }

  const [formData, setFormData] = useState({
    id: "",
    origin: "",
    destination: "",
    date: "",
    time: "",
    price: "",
    seats: 40,
  })

  // State untuk search dan filter bookings
  const [bookingSearch, setBookingSearch] = useState("")
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all")
  const [users, setUsers] = useState([])
  const [showAddBookingModal, setShowAddBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    userId: "",
    userName: "",
    email: "",
    phone: "",
    scheduleId: "",
    seats: 1,
    seatNumbers: "",
    totalPrice: 0,
    status: "pending",
  })

  // State untuk search dan filter schedules
  const [scheduleSearch, setScheduleSearch] = useState("")
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState("all")

  // Filter schedules berdasarkan search dan status
  const filteredSchedules = schedules.filter(schedule => {
    const matchSearch =
      scheduleSearch === "" ||
      (schedule.id && schedule.id.toLowerCase().includes(scheduleSearch.toLowerCase())) ||
      (schedule.origin && schedule.origin.toLowerCase().includes(scheduleSearch.toLowerCase())) ||
      (schedule.destination && schedule.destination.toLowerCase().includes(scheduleSearch.toLowerCase()))

    const matchStatus = scheduleStatusFilter === "all" || schedule.status === scheduleStatusFilter

    return matchSearch && matchStatus
  })

  // Filter bookings berdasarkan search dan status
  const filteredBookings = bookings.filter(booking => {
    const matchSearch =
      bookingSearch === "" ||
      (booking.userName && booking.userName.toLowerCase().includes(bookingSearch.toLowerCase())) ||
      (booking.id && booking.id.toLowerCase().includes(bookingSearch.toLowerCase())) ||
      (booking.email && booking.email.toLowerCase().includes(bookingSearch.toLowerCase()))

    const matchStatus = bookingStatusFilter === "all" || booking.status === bookingStatusFilter

    return matchSearch && matchStatus
  })

  const toggleAdminMenu = () => {
    setShowAdminMenu(!showAdminMenu)
  }

  const handleNavigateHome = () => {
    navigate("/")
    setShowAdminMenu(false)
  }

  const handleLogoutAdmin = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      logout()
      setShowAdminMenu(false)
      navigate("/login")
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (showAdminMenu && !event.target.closest(".admin-user-info")) {
        setShowAdminMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showAdminMenu])

  const handleAddSchedule = () => {
    setFormData({
      id: "",
      origin: "",
      destination: "",
      date: "",
      time: "",
      price: "",
      seats: 40,
    })
    setShowAddScheduleModal(true)
  }

  const handleEditSchedule = schedule => {
    setSelectedSchedule(schedule)
    setFormData({
      id: schedule.id || "",
      origin: schedule.origin,
      destination: schedule.destination,
      date: schedule.date,
      time: schedule.time,
      price: schedule.price,
      seats: schedule.seats,
    })
    setShowEditScheduleModal(true)
  }

  const handleDeleteSchedule = schedule => {
    setSelectedSchedule(schedule)
    setShowDeleteConfirm(true)
  }

  const openAddBooking = () => {
    setBookingForm({ userId: "", userName: "", email: "", phone: "", scheduleId: "", seats: 1, seatNumbers: "", totalPrice: 0, status: "pending" })
    setShowAddBookingModal(true)
  }

  const handleBookingInputChange = e => {
    const { name, value } = e.target
    setBookingForm(prev => ({ ...prev, [name]: value }))
  }

  const submitBooking = async e => {
    e.preventDefault()
    const payload = {
      userId: bookingForm.userId || undefined,
      userName: bookingForm.userName,
      email: bookingForm.email,
      phone: bookingForm.phone,
      scheduleId: bookingForm.scheduleId,
      seats: Number(bookingForm.seats),
      nomor_kursi: bookingForm.seatNumbers ? bookingForm.seatNumbers.split(/\s*,\s*/g) : [],
      totalPrice: Number(bookingForm.totalPrice),
      status: bookingForm.status,
    }
  }

  const confirmDelete = () => {
    ;(async () => {
      const idForApi = selectedSchedule?._id || selectedSchedule?.id
      const result = await deleteSchedule(idForApi)

      if (result.success) {
        await loadData()
        setShowDeleteConfirm(false)
        setSelectedSchedule(null)
        alert("Jadwal berhasil dihapus!")
      } else {
        alert(result.message || "Gagal menghapus jadwal!")
      }
    })()
  }

  const handleSubmitSchedule = e => {
    e.preventDefault()

    if (showAddScheduleModal) {
      // Add new schedule ke localStorage
      const scheduleData = {
        id: formData.id && String(formData.id).trim() !== "" ? String(formData.id).trim() : undefined,
        origin: formData.origin,
        destination: formData.destination,
        date: formData.date,
        time: formData.time,
        price: parseInt(formData.price),
        seats: parseInt(formData.seats),
      }
      ;(async () => {
        const result = await addSchedule(scheduleData)
        console.log("addSchedule result:", result)
        if (result.success) {
          await loadData()
          setShowAddScheduleModal(false)
          alert("Jadwal berhasil ditambahkan!")
        } else {
          console.error("addSchedule error details:", result.details)
          // If backend returns validation errors, show them clearly
          if (result.details && Array.isArray(result.details.errors)) {
            const msgs = result.details.errors.map(e => (e.path ? `${e.path}: ${e.msg}` : e.msg)).join("\n")
            alert(`Gagal menambahkan jadwal:\n${msgs}`)
          } else {
            alert(result.message || "Gagal menambahkan jadwal!")
          }
        }
      })()
    } else if (showEditScheduleModal) {
      // Update existing schedule di localStorage
      const updates = {
        id: formData.id && String(formData.id).trim() !== "" ? String(formData.id).trim() : undefined,
        origin: formData.origin,
        destination: formData.destination,
        date: formData.date,
        time: formData.time,
        price: parseInt(formData.price),
        seats: parseInt(formData.seats),
      }
      ;(async () => {
        const idForApi = selectedSchedule?._id || selectedSchedule?.id
        const result = await updateSchedule(idForApi, updates)
        console.log("updateSchedule result:", result)

        if (result.success) {
          // if server returned updated schedule, prefer reloading from API
          await loadData()
          setShowEditScheduleModal(false)
          alert("Jadwal berhasil diperbarui!")
        } else {
          console.error("updateSchedule error details:", result.details || result)
          alert(result.message || "Gagal memperbarui jadwal!")
        }
      })()
    }

    // Reset form
    setFormData({
      id: "",
      origin: "",
      destination: "",
      date: "",
      time: "",
      price: "",
      seats: 40,
    })
    setSelectedSchedule(null)
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = dateString => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("id-ID", options)
  }

  const getStatusBadge = status => {
    const statusConfig = {
      active: { label: "Aktif", className: "status-active" },
      inactive: { label: "Tidak Aktif", className: "status-inactive" },
      confirmed: { label: "Terkonfirmasi", className: "status-confirmed" },
      pending: { label: "Menunggu", className: "status-pending" },
      completed: { label: "Selesai", className: "status-completed" },
      cancelled: { label: "Dibatalkan", className: "status-cancelled" },
    }

    const config = statusConfig[status] || { label: status, className: "" }
    return <span className={`status-badge ${config.className}`}>{config.label}</span>
  }

  const handleUpdateBookingStatus = async (booking, newStatus) => {
    console.log("[handleUpdateBookingStatus] Called with:", { booking, newStatus })
    console.log("[handleUpdateBookingStatus] Using _id:", booking._id)
    
    try {
      // Gunakan _id (MongoDB ObjectId) untuk API call, bukan display ID (kode_booking)
      const result = await updateBookingStatus(booking._id, newStatus)
      console.log("[handleUpdateBookingStatus] Result:", result)

      if (result.success) {
        console.log("[handleUpdateBookingStatus] Reloading data...")
        await loadData()
        alert(`Status booking berhasil diubah menjadi ${newStatus}!`)
      } else {
        console.error("[handleUpdateBookingStatus] Failed:", result.message)
        alert(result.message || "Gagal mengubah status booking!")
      }
    } catch (error) {
      console.error("[handleUpdateBookingStatus] Exception:", error)
      alert(`Error: ${error.message}`)
    }
  }

  // Return early jika belum login, loading, atau bukan admin
  if (loading || !isLoggedIn || currentUser?.role !== "admin") {
    return null
  }

  return (
    <div className="admin-panel">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard Admin</h1>
          <div className="admin-user-info">
            <button className="admin-user-btn" onClick={toggleAdminMenu}>
              <span className="admin-user-icon">👤</span>
              <span className="admin-user-name">{currentUser?.namaLengkap || "Admin"}</span>
              <span className="admin-dropdown-icon">{showAdminMenu ? "▲" : "▼"}</span>
            </button>

            {showAdminMenu && (
              <div className="admin-user-dropdown">
                <div className="admin-dropdown-header">
                  <span className="admin-dropdown-name">{currentUser?.namaLengkap}</span>
                  <span className="admin-dropdown-role">Administrator</span>
                </div>
                <div className="admin-dropdown-divider"></div>
                <button className="admin-dropdown-item" onClick={handleNavigateHome}>
                  <span className="admin-dropdown-item-icon">🏠</span>
                  <span>Homepage</span>
                </button>
                <button
                  className="admin-dropdown-item"
                  onClick={() => {
                    navigate("/profile")
                    setShowAdminMenu(false)
                  }}
                >
                  <span className="admin-dropdown-item-icon">👤</span>
                  <span>Profile</span>
                </button>
                <div className="admin-dropdown-divider"></div>
                <button className="admin-dropdown-item logout" onClick={handleLogoutAdmin}>
                  <span className="admin-dropdown-item-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="dashboard-section">
            <h2>Statistik</h2>
            <div className="stats-grid">
              <StatCard title="Total Jadwal" value={stats.totalSchedules} icon="📅" color="blue" />
              <StatCard title="Total Pemesanan" value={stats.totalBookings} icon="🎫" color="green" />
              <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon="💰" color="orange" />
              <StatCard title="Pemesanan Pending" value={stats.pendingBookings} icon="⏳" color="red" />
            </div>

            {/* Booking Charts */}
            <BookingChart bookings={bookings} />
          </div>
        )}

        {activeTab === "schedules" && (
          <div className="schedules-section">
            <div className="section-header">
              <h2>Manajemen Jadwal</h2>
              <button className="add-btn" onClick={handleAddSchedule}>
                + Tambah Jadwal
              </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bookings-controls">
              <div className="search-box">
                <input type="text" placeholder="🔍 Cari berdasarkan ID, asal, atau tujuan..." value={scheduleSearch} onChange={e => setScheduleSearch(e.target.value)} className="search-input" />
              </div>
              <div className="filter-box">
                <select value={scheduleStatusFilter} onChange={e => setScheduleStatusFilter(e.target.value)} className="filter-select">
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
              <div className="results-count">
                Menampilkan {filteredSchedules.length} dari {schedules.length} jadwal
              </div>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Rute</th>
                    <th>Tanggal</th>
                    <th>Waktu</th>
                    <th>Harga</th>
                    <th>Kursi</th>
                    <th>Tersedia</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.length > 0 ? (
                    filteredSchedules.map(schedule => (
                      <tr key={schedule.id}>
                        <td>{schedule.id}</td>
                        <td>
                          {schedule.origin} → {schedule.destination}
                        </td>
                        <td>{formatDate(schedule.date)}</td>
                        <td>{schedule.time}</td>
                        <td>{formatCurrency(schedule.price)}</td>
                        <td>{schedule.seats}</td>
                        <td>{schedule.availableSeats}</td>
                        <td>{getStatusBadge(schedule.status)}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="edit-btn" onClick={() => handleEditSchedule(schedule)}>
                              Edit
                            </button>
                            <button className="delete-btn" onClick={() => handleDeleteSchedule(schedule)}>
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="no-data">
                        {scheduleSearch || scheduleStatusFilter !== "all" ? "🔍 Tidak ada jadwal yang sesuai dengan pencarian" : "📅 Belum ada jadwal"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bookings-section">
            <div className="section-header">
              <h2>Manajemen Pemesanan</h2>
              <button className="add-btn" onClick={openAddBooking}>
                + Tambah Pemesanan
              </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bookings-controls">
              <div className="search-box">
                <input type="text" placeholder="🔍 Cari berdasarkan nama, ID, atau email..." value={bookingSearch} onChange={e => setBookingSearch(e.target.value)} className="search-input" />
              </div>
              <div className="filter-box">
                <select value={bookingStatusFilter} onChange={e => setBookingStatusFilter(e.target.value)} className="filter-select">
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="confirmed">Terkonfirmasi</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
              <div className="results-count">
                Menampilkan {filteredBookings.length} dari {bookings.length} pemesanan
              </div>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No. HP</th>
                    <th>Rute</th>
                    <th>Tanggal</th>
                    <th>Kursi</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Tgl. Booking</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.userName}</td>
                        <td>{booking.email}</td>
                        <td>{booking.phone}</td>
                        <td>
                          {booking.origin} → {booking.destination}
                        </td>
                        <td>{formatDate(booking.date)}</td>
                        <td>{booking.seats}</td>
                        <td>{formatCurrency(booking.totalPrice)}</td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>{formatDate(booking.bookingDate)}</td>
                        <td>
                          <div className="action-buttons">
                            {booking.status === "pending" && (
                              <>
                                <button className="action-btn confirm-btn" onClick={() => {
                                  console.log("🔍 Booking object:", booking);
                                  console.log("🔍 Sending _id:", booking._id);
                                  handleUpdateBookingStatus(booking, "confirmed");
                                }} title="Konfirmasi">
                                  ✓
                                </button>
                                <button className="action-btn cancel-btn" onClick={() => {
                                  console.log("🔍 Booking object:", booking);
                                  console.log("🔍 Sending _id:", booking._id);
                                  handleUpdateBookingStatus(booking, "cancelled");
                                }} title="Batalkan">
                                  ✕
                                </button>
                              </>
                            )}
                            {booking.status === "confirmed" && (
                              <button className="action-btn complete-btn" onClick={() => {
                                console.log("🔍 Booking object:", booking);
                                console.log("🔍 Sending _id:", booking._id);
                                handleUpdateBookingStatus(booking, "completed");
                              }} title="Tandai Selesai">
                                ✓✓
                              </button>
                            )}
                            {(booking.status === "completed" || booking.status === "cancelled") && <span className="no-action">-</span>}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="no-data">
                        {bookingSearch || bookingStatusFilter !== "all" ? "🔍 Tidak ada pemesanan yang sesuai dengan pencarian" : "📝 Belum ada pemesanan"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Schedule Modal */}
      {showAddScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowAddScheduleModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Jadwal Baru</h3>
              <button className="close-modal" onClick={() => setShowAddScheduleModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitSchedule}>
              <div className="form-group">
                <label>ID Jadwal</label>
                <input type="text" name="id" value={formData.id} onChange={handleInputChange} placeholder="JDW005" />
              </div>
              <div className="form-group">
                <label>Kota Asal</label>
                <input type="text" name="origin" value={formData.origin} onChange={handleInputChange} placeholder="Contoh: Jakarta" required />
              </div>
              <div className="form-group">
                <label>Kota Tujuan</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} placeholder="Contoh: Surabaya" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Waktu</label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Harga (Rp)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="250000" required />
                </div>
                <div className="form-group">
                  <label>Jumlah Kursi</label>
                  <input type="number" name="seats" value={formData.seats} onChange={handleInputChange} min="1" required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddScheduleModal(false)}>
                  Batal
                </button>
                <button type="submit" className="submit-btn">
                  Tambah Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {showEditScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowEditScheduleModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Jadwal</h3>
              <button className="close-modal" onClick={() => setShowEditScheduleModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitSchedule}>
              <div className="form-group">
                <label>ID Jadwal</label>
                <input type="text" name="id" value={formData.id} onChange={handleInputChange} placeholder="JDW005" />
              </div>
              <div className="form-group">
                <label>Kota Asal</label>
                <input type="text" name="origin" value={formData.origin} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Kota Tujuan</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Waktu</label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Harga (Rp)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Jumlah Kursi</label>
                  <input type="number" name="seats" value={formData.seats} onChange={handleInputChange} min="1" required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditScheduleModal(false)}>
                  Batal
                </button>
                <button type="submit" className="submit-btn">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Konfirmasi Hapus</h3>
              <button className="close-modal" onClick={() => setShowDeleteConfirm(false)}>
                ×
              </button>
            </div>
            <div className="confirm-content">
              <p>Apakah Anda yakin ingin menghapus jadwal ini?</p>
              <div className="schedule-info">
                <p>
                  <strong>ID:</strong> {selectedSchedule?.id}
                </p>
                <p>
                  <strong>Rute:</strong> {selectedSchedule?.origin} → {selectedSchedule?.destination}
                </p>
                <p>
                  <strong>Tanggal:</strong> {selectedSchedule && formatDate(selectedSchedule.date)}
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                Batal
              </button>
              <button className="delete-confirm-btn" onClick={confirmDelete}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAddBookingModal && (
        <div className="modal-overlay" onClick={() => setShowAddBookingModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Pemesanan</h3>
              <button className="close-modal" onClick={() => setShowAddBookingModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={submitBooking}>
              <div className="form-group">
                <label>Pilih User</label>
                <select name="userId" value={bookingForm.userId} onChange={handleBookingInputChange}>
                  <option value="">-- Pilih User (atau kosong untuk input manual) --</option>
                  {users.map(u => (
                    <option key={u.id || u._id} value={u.id || u._id}>
                      {u.namaLengkap || u.nama || u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nama Pemesan</label>
                  <input type="text" name="userName" value={bookingForm.userName} onChange={handleBookingInputChange} placeholder="Nama lengkap" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={bookingForm.email} onChange={handleBookingInputChange} placeholder="email@example.com" />
                </div>
              </div>

              <div className="form-group">
                <label>Nomor HP</label>
                <input type="text" name="phone" value={bookingForm.phone} onChange={handleBookingInputChange} placeholder="08xxxx" />
              </div>

              <div className="form-group">
                <label>Pilih Jadwal</label>
                <select name="scheduleId" value={bookingForm.scheduleId} onChange={handleBookingInputChange} required>
                  <option value="">-- Pilih Jadwal --</option>
                  {schedules.map(s => (
                    <option key={s._id || s.id} value={s._id || s.id}>{`${s.id || s._id} — ${s.origin} → ${s.destination} (${s.date} ${s.time})`}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Jumlah Kursi</label>
                  <input type="number" name="seats" value={bookingForm.seats} onChange={handleBookingInputChange} min="1" required />
                </div>
                <div className="form-group">
                  <label>Nomor Kursi (pisah koma)</label>
                  <input type="text" name="seatNumbers" value={bookingForm.seatNumbers} onChange={handleBookingInputChange} placeholder="A1, A2" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Harga</label>
                  <input type="number" name="totalPrice" value={bookingForm.totalPrice} onChange={handleBookingInputChange} min="0" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={bookingForm.status} onChange={handleBookingInputChange}>
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                    <option value="completed">completed</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddBookingModal(false)}>
                  Batal
                </button>
                <button type="submit" className="submit-btn">
                  Buat Pemesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanelPage
