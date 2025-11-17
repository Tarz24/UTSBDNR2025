import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import ScheduleTable from '../../components/admin/ScheduleTable';
import './AdminPanelPage.css';

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Dummy statistics data
  const stats = {
    totalSchedules: 24,
    totalBookings: 156,
    totalRevenue: 45650000,
    pendingBookings: 8
  };

  // Dummy schedules data
  const [schedules, setSchedules] = useState([
    {
      id: 'JDW001',
      origin: 'Jakarta',
      destination: 'Surabaya',
      date: '2024-01-20',
      time: '08:00',
      price: 250000,
      seats: 40,
      availableSeats: 35,
      status: 'active'
    },
    {
      id: 'JDW002',
      origin: 'Bandung',
      destination: 'Yogyakarta',
      date: '2024-01-21',
      time: '09:00',
      price: 200000,
      seats: 40,
      availableSeats: 28,
      status: 'active'
    },
    {
      id: 'JDW003',
      origin: 'Surabaya',
      destination: 'Bali',
      date: '2024-01-22',
      time: '10:00',
      price: 300000,
      seats: 40,
      availableSeats: 40,
      status: 'active'
    },
    {
      id: 'JDW004',
      origin: 'Jakarta',
      destination: 'Bali',
      date: '2024-01-23',
      time: '07:00',
      price: 350000,
      seats: 40,
      availableSeats: 15,
      status: 'active'
    }
  ]);

  // Dummy bookings data
  const [bookings] = useState([
    {
      id: 'BK001',
      userName: 'Ahmad Fadli',
      email: 'ahmad@email.com',
      phone: '081234567890',
      scheduleId: 'JDW001',
      origin: 'Jakarta',
      destination: 'Surabaya',
      date: '2024-01-20',
      time: '08:00',
      seats: 2,
      totalPrice: 500000,
      status: 'confirmed',
      bookingDate: '2024-01-15'
    },
    {
      id: 'BK002',
      userName: 'Siti Nurhaliza',
      email: 'siti@email.com',
      phone: '081234567891',
      scheduleId: 'JDW002',
      origin: 'Bandung',
      destination: 'Yogyakarta',
      date: '2024-01-21',
      time: '09:00',
      seats: 1,
      totalPrice: 200000,
      status: 'pending',
      bookingDate: '2024-01-16'
    },
    {
      id: 'BK003',
      userName: 'Budi Santoso',
      email: 'budi@email.com',
      phone: '081234567892',
      scheduleId: 'JDW004',
      origin: 'Jakarta',
      destination: 'Bali',
      date: '2024-01-23',
      time: '07:00',
      seats: 3,
      totalPrice: 1050000,
      status: 'completed',
      bookingDate: '2024-01-14'
    },
    {
      id: 'BK004',
      userName: 'Dewi Kartika',
      email: 'dewi@email.com',
      phone: '081234567893',
      scheduleId: 'JDW001',
      origin: 'Jakarta',
      destination: 'Surabaya',
      date: '2024-01-20',
      time: '08:00',
      seats: 1,
      totalPrice: 250000,
      status: 'cancelled',
      bookingDate: '2024-01-15'
    }
  ]);

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    price: '',
    seats: 40
  });

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      // TODO: Clear auth token
      navigate('/login');
    }
  };

  const handleAddSchedule = () => {
    setFormData({
      origin: '',
      destination: '',
      date: '',
      time: '',
      price: '',
      seats: 40
    });
    setShowAddScheduleModal(true);
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      origin: schedule.origin,
      destination: schedule.destination,
      date: schedule.date,
      time: schedule.time,
      price: schedule.price,
      seats: schedule.seats
    });
    setShowEditScheduleModal(true);
  };

  const handleDeleteSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setSchedules(schedules.filter(s => s.id !== selectedSchedule.id));
    setShowDeleteConfirm(false);
    setSelectedSchedule(null);
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    
    if (showAddScheduleModal) {
      // Add new schedule
      const newSchedule = {
        id: `JDW${String(schedules.length + 1).padStart(3, '0')}`,
        ...formData,
        availableSeats: formData.seats,
        status: 'active'
      };
      setSchedules([...schedules, newSchedule]);
      setShowAddScheduleModal(false);
    } else if (showEditScheduleModal) {
      // Update existing schedule
      setSchedules(schedules.map(s => 
        s.id === selectedSchedule.id 
          ? { ...s, ...formData, availableSeats: formData.seats - (s.seats - s.availableSeats) }
          : s
      ));
      setShowEditScheduleModal(false);
    }

    // Reset form
    setFormData({
      origin: '',
      destination: '',
      date: '',
      time: '',
      price: '',
      seats: 40
    });
    setSelectedSchedule(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Aktif', className: 'status-active' },
      inactive: { label: 'Tidak Aktif', className: 'status-inactive' },
      confirmed: { label: 'Terkonfirmasi', className: 'status-confirmed' },
      pending: { label: 'Menunggu', className: 'status-pending' },
      completed: { label: 'Selesai', className: 'status-completed' },
      cancelled: { label: 'Dibatalkan', className: 'status-cancelled' }
    };

    const config = statusConfig[status] || { label: status, className: '' };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  return (
    <div className="admin-panel">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard Admin</h1>
          <div className="admin-user-info">
            <span className="admin-name">Admin User</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="dashboard-section">
            <h2>Statistik</h2>
            <div className="stats-grid">
              <StatCard
                title="Total Jadwal"
                value={stats.totalSchedules}
                icon="📅"
                color="blue"
              />
              <StatCard
                title="Total Pemesanan"
                value={stats.totalBookings}
                icon="🎫"
                color="green"
              />
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon="💰"
                color="orange"
              />
              <StatCard
                title="Pemesanan Pending"
                value={stats.pendingBookings}
                icon="⏳"
                color="red"
              />
            </div>
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="schedules-section">
            <div className="section-header">
              <h2>Manajemen Jadwal</h2>
              <button className="add-btn" onClick={handleAddSchedule}>
                + Tambah Jadwal
              </button>
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
                  {schedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td>{schedule.id}</td>
                      <td>{schedule.origin} → {schedule.destination}</td>
                      <td>{formatDate(schedule.date)}</td>
                      <td>{schedule.time}</td>
                      <td>{formatCurrency(schedule.price)}</td>
                      <td>{schedule.seats}</td>
                      <td>{schedule.availableSeats}</td>
                      <td>{getStatusBadge(schedule.status)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEditSchedule(schedule)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteSchedule(schedule)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div className="section-header">
              <h2>Manajemen Pemesanan</h2>
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
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.userName}</td>
                      <td>{booking.email}</td>
                      <td>{booking.phone}</td>
                      <td>{booking.origin} → {booking.destination}</td>
                      <td>{formatDate(booking.date)}</td>
                      <td>{booking.seats}</td>
                      <td>{formatCurrency(booking.totalPrice)}</td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>{formatDate(booking.bookingDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Schedule Modal */}
      {showAddScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowAddScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Jadwal Baru</h3>
              <button 
                className="close-modal"
                onClick={() => setShowAddScheduleModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitSchedule}>
              <div className="form-group">
                <label>Kota Asal</label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  placeholder="Contoh: Jakarta"
                  required
                />
              </div>
              <div className="form-group">
                <label>Kota Tujuan</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="Contoh: Surabaya"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Waktu</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Harga (Rp)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="250000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Jumlah Kursi</label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddScheduleModal(false)}
                >
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Jadwal</h3>
              <button 
                className="close-modal"
                onClick={() => setShowEditScheduleModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitSchedule}>
              <div className="form-group">
                <label>Kota Asal</label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Kota Tujuan</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Waktu</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Harga (Rp)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Jumlah Kursi</label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowEditScheduleModal(false)}
                >
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
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Konfirmasi Hapus</h3>
              <button 
                className="close-modal"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ×
              </button>
            </div>
            <div className="confirm-content">
              <p>Apakah Anda yakin ingin menghapus jadwal ini?</p>
              <div className="schedule-info">
                <p><strong>ID:</strong> {selectedSchedule?.id}</p>
                <p><strong>Rute:</strong> {selectedSchedule?.origin} → {selectedSchedule?.destination}</p>
                <p><strong>Tanggal:</strong> {selectedSchedule && formatDate(selectedSchedule.date)}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Batal
              </button>
              <button 
                className="delete-confirm-btn"
                onClick={confirmDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
