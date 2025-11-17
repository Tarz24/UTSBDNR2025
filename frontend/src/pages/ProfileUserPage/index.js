import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import TicketCard from '../../components/TicketCard';
import './ProfileUserPage.css';

function ProfileUserPage() {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, getUserBookings, updateProfile, changePassword } = useAuth();

  // Redirect jika belum login
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Load booking history dari localStorage
  const [bookingHistory, setBookingHistory] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const userBookings = getUserBookings();
      setBookingHistory(userBookings);
    }
  }, [currentUser, getUserBookings]);

  // State untuk modal edit profile
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    namaLengkap: '',
    noHp: ''
  });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  // State untuk modal ganti password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // State untuk filter
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter booking berdasarkan status
  const filteredBookings = bookingHistory.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  // Hitung statistik
  const stats = {
    total: bookingHistory.length,
    confirmed: bookingHistory.filter(b => b.status === 'confirmed').length,
    completed: bookingHistory.filter(b => b.status === 'completed').length,
    cancelled: bookingHistory.filter(b => b.status === 'cancelled').length
  };

  // Format tanggal bergabung
  const formatJoinDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('id-ID', options);
  };

  // Handle edit profile
  const handleEditProfile = () => {
    setEditFormData({
      namaLengkap: currentUser?.namaLengkap || '',
      noHp: currentUser?.noHp || ''
    });
    setEditError('');
    setEditSuccess(false);
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    setEditError('');
    
    // Validasi
    if (!editFormData.namaLengkap || editFormData.namaLengkap.length < 3) {
      setEditError('Nama minimal 3 karakter');
      return;
    }
    
    if (!editFormData.noHp || !/^[0-9]{10,13}$/.test(editFormData.noHp)) {
      setEditError('Nomor HP tidak valid (10-13 digit)');
      return;
    }

    // Update menggunakan AuthContext
    const result = updateProfile({
      namaLengkap: editFormData.namaLengkap,
      noHp: editFormData.noHp
    });

    if (result.success) {
      console.log('✅ Profile updated successfully!');
      setEditSuccess(true);
      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccess(false);
      }, 1500);
    } else {
      setEditError(result.message);
    }
  };

  // Handle ganti password
  const handleChangePassword = () => {
    setPasswordFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess(false);
    setShowPasswordModal(true);
  };

  const handleSavePassword = () => {
    setPasswordError('');
    
    // Validasi
    if (!passwordFormData.oldPassword || !passwordFormData.newPassword || !passwordFormData.confirmPassword) {
      setPasswordError('Semua field wajib diisi!');
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      setPasswordError('Password baru minimal 6 karakter');
      return;
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordError('Password baru tidak cocok!');
      return;
    }

    // Update menggunakan AuthContext
    const result = changePassword(passwordFormData.oldPassword, passwordFormData.newPassword);

    if (result.success) {
      console.log('✅ Password changed successfully!');
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
        setPasswordFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 1500);
    } else {
      setPasswordError(result.message);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      // Akan di-handle oleh Navbar
      navigate('/');
    }
  };

  // Return early jika belum login atau user belum ada
  if (!isLoggedIn || !currentUser) {
    return null;
  }

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {currentUser.namaLengkap.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="profile-info">
              <h2>{currentUser.namaLengkap}</h2>
              <p className="profile-email">📧 {currentUser.email}</p>
              <p className="profile-phone">📱 {currentUser.noHp}</p>
              <p className="profile-join-date">
                📅 Bergabung sejak {formatJoinDate(currentUser.createdAt)}
              </p>
            </div>

            <div className="profile-actions">
              <button className="action-btn edit-btn" onClick={handleEditProfile}>
                ✏️ Edit Profile
              </button>
              <button className="action-btn password-btn" onClick={handleChangePassword}>
                🔒 Ganti Password
              </button>
              <button className="action-btn logout-btn" onClick={handleLogout}>
                🚪 Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Pemesanan</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.confirmed}</h3>
              <p>Dikonfirmasi</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✔️</div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Selesai</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3>{stats.cancelled}</h3>
              <p>Dibatalkan</p>
            </div>
          </div>
        </div>

        {/* Booking History */}
        <div className="booking-history-section">
          <div className="section-header">
            <h2>Riwayat Pemesanan</h2>
          </div>

          {/* Filter Tabs */}
          <div className="history-filter">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Semua ({stats.total})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('confirmed')}
            >
              Dikonfirmasi ({stats.confirmed})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Selesai ({stats.completed})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilterStatus('cancelled')}
            >
              Dibatalkan ({stats.cancelled})
            </button>
          </div>

          {/* Booking List */}
          <div className="booking-list">
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <TicketCard 
                  key={booking.id} 
                  ticket={{
                    _id: booking.id,
                    kodePemesanan: booking.id,
                    status: booking.status,
                    tanggalPemesanan: booking.bookingDate,
                    jadwalPergi: {
                      _id: booking.scheduleId,
                      kotaAsal: booking.origin,
                      kotaTujuan: booking.destination,
                      tanggalKeberangkatan: booking.date,
                      jamKeberangkatan: booking.time,
                      harga: booking.price
                    },
                    jumlahPenumpang: booking.seats,
                    totalHarga: booking.totalPrice,
                    namaPenumpang: booking.userName,
                    noHpPenumpang: booking.userPhone,
                    emailPenumpang: booking.userEmail
                  }} 
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎫</div>
                <h3>Tidak ada riwayat</h3>
                <p>Anda belum memiliki pemesanan dengan status ini</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Edit Profile */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {editSuccess && (
                <div className="alert alert-success">
                  <span>✅</span>
                  <span>Profile berhasil diupdate!</span>
                </div>
              )}
              {editError && (
                <div className="alert alert-error">
                  <span>⚠️</span>
                  <span>{editError}</span>
                </div>
              )}
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  value={editFormData.namaLengkap}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, namaLengkap: e.target.value }))}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="form-group">
                <label>Nomor HP</label>
                <input
                  type="tel"
                  value={editFormData.noHp}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, noHp: e.target.value }))}
                  placeholder="Masukkan nomor HP"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="disabled-input"
                />
                <small>Email tidak dapat diubah</small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                Batal
              </button>
              <button className="btn-save" onClick={handleSaveProfile}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ganti Password */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ganti Password</h3>
              <button className="close-btn" onClick={() => setShowPasswordModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {passwordSuccess && (
                <div className="alert alert-success">
                  <span>✅</span>
                  <span>Password berhasil diubah!</span>
                </div>
              )}
              {passwordError && (
                <div className="alert alert-error">
                  <span>⚠️</span>
                  <span>{passwordError}</span>
                </div>
              )}
              <div className="form-group">
                <label>Password Lama</label>
                <input
                  type="password"
                  value={passwordFormData.oldPassword}
                  onChange={(e) => setPasswordFormData(prev => ({ ...prev, oldPassword: e.target.value }))}
                  placeholder="Masukkan password lama"
                />
              </div>
              <div className="form-group">
                <label>Password Baru</label>
                <input
                  type="password"
                  value={passwordFormData.newPassword}
                  onChange={(e) => setPasswordFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div className="form-group">
                <label>Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={passwordFormData.confirmPassword}
                  onChange={(e) => setPasswordFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Ulangi password baru"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowPasswordModal(false)}>
                Batal
              </button>
              <button className="btn-save" onClick={handleSavePassword}>
                Ubah Password
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ProfileUserPage;
