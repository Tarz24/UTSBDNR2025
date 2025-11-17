import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import TicketCard from '../../components/TicketCard';
import './ProfileUserPage.css';

function ProfileUserPage() {
  // Dummy data user (nanti akan diambil dari AuthContext)
  const [user, setUser] = useState({
    _id: 'user123',
    namaLengkap: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    noHp: '081234567890',
    tanggalBergabung: '2024-01-15T10:00:00'
  });

  // Dummy data riwayat pemesanan (nanti akan diambil dari API)
  const [bookingHistory] = useState([
    {
      _id: '1',
      kodePemesanan: 'BRY20241117001',
      status: 'confirmed',
      tanggalPemesanan: '2024-11-15T10:30:00',
      jadwalPergi: {
        _id: 'j1',
        kotaAsal: 'Surabaya',
        kotaTujuan: 'Jakarta',
        tanggalKeberangkatan: '2024-11-20T08:00:00',
        jamKeberangkatan: '08:00',
        jamKedatangan: '16:00',
        harga: 250000,
        kursiTersedia: 30,
        totalKursi: 45,
        armada: 'Executive A'
      },
      jadwalPulang: {
        _id: 'j2',
        kotaAsal: 'Jakarta',
        kotaTujuan: 'Surabaya',
        tanggalKeberangkatan: '2024-11-25T09:00:00',
        jamKeberangkatan: '09:00',
        jamKedatangan: '17:00',
        harga: 250000,
        kursiTersedia: 25,
        totalKursi: 45,
        armada: 'Executive B'
      },
      jumlahPenumpang: 2,
      totalHarga: 1000000,
      namaPenumpang: 'Budi Santoso',
      noHpPenumpang: '081234567890',
      emailPenumpang: 'budi.santoso@email.com'
    },
    {
      _id: '2',
      kodePemesanan: 'BRY20241117002',
      status: 'confirmed',
      tanggalPemesanan: '2024-11-10T14:20:00',
      jadwalPergi: {
        _id: 'j3',
        kotaAsal: 'Surabaya',
        kotaTujuan: 'Bandung',
        tanggalKeberangkatan: '2024-11-18T07:00:00',
        jamKeberangkatan: '07:00',
        jamKedatangan: '18:00',
        harga: 300000,
        kursiTersedia: 20,
        totalKursi: 45,
        armada: 'Super Executive'
      },
      jadwalPulang: null,
      jumlahPenumpang: 1,
      totalHarga: 300000,
      namaPenumpang: 'Budi Santoso',
      noHpPenumpang: '081234567890',
      emailPenumpang: 'budi.santoso@email.com'
    },
    {
      _id: '3',
      kodePemesanan: 'BRY20241117003',
      status: 'cancelled',
      tanggalPemesanan: '2024-11-05T09:15:00',
      jadwalPergi: {
        _id: 'j4',
        kotaAsal: 'Surabaya',
        kotaTujuan: 'Malang',
        tanggalKeberangkatan: '2024-11-08T10:00:00',
        jamKeberangkatan: '10:00',
        jamKedatangan: '13:00',
        harga: 100000,
        kursiTersedia: 35,
        totalKursi: 45,
        armada: 'Economy'
      },
      jadwalPulang: null,
      jumlahPenumpang: 1,
      totalHarga: 100000,
      namaPenumpang: 'Budi Santoso',
      noHpPenumpang: '081234567890',
      emailPenumpang: 'budi.santoso@email.com'
    },
    {
      _id: '4',
      kodePemesanan: 'BRY20241020004',
      status: 'completed',
      tanggalPemesanan: '2024-10-15T11:00:00',
      jadwalPergi: {
        _id: 'j5',
        kotaAsal: 'Surabaya',
        kotaTujuan: 'Semarang',
        tanggalKeberangkatan: '2024-10-20T09:00:00',
        jamKeberangkatan: '09:00',
        jamKedatangan: '15:00',
        harga: 200000,
        kursiTersedia: 28,
        totalKursi: 45,
        armada: 'Executive'
      },
      jadwalPulang: null,
      jumlahPenumpang: 1,
      totalHarga: 200000,
      namaPenumpang: 'Budi Santoso',
      noHpPenumpang: '081234567890',
      emailPenumpang: 'budi.santoso@email.com'
    }
  ]);

  // State untuk modal edit profile
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    namaLengkap: user.namaLengkap,
    noHp: user.noHp
  });

  // State untuk modal ganti password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('id-ID', options);
  };

  // Handle edit profile
  const handleEditProfile = () => {
    setEditFormData({
      namaLengkap: user.namaLengkap,
      noHp: user.noHp
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    // Nanti akan call API untuk update profile
    console.log('Update profile:', editFormData);
    setUser(prev => ({
      ...prev,
      namaLengkap: editFormData.namaLengkap,
      noHp: editFormData.noHp
    }));
    setShowEditModal(false);
    alert('Profile berhasil diupdate!');
  };

  // Handle ganti password
  const handleChangePassword = () => {
    setPasswordFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordModal(true);
  };

  const handleSavePassword = () => {
    // Validasi
    if (!passwordFormData.oldPassword || !passwordFormData.newPassword || !passwordFormData.confirmPassword) {
      alert('Semua field wajib diisi!');
      return;
    }
    if (passwordFormData.newPassword.length < 6) {
      alert('Password baru minimal 6 karakter!');
      return;
    }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      alert('Password baru tidak cocok!');
      return;
    }

    // Nanti akan call API untuk update password
    console.log('Change password');
    setShowPasswordModal(false);
    alert('Password berhasil diubah!');
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      console.log('Logout user');
      // Nanti akan clear AuthContext dan redirect ke HomePage
      alert('Logout berhasil!');
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user.namaLengkap.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="profile-info">
              <h2>{user.namaLengkap}</h2>
              <p className="profile-email">📧 {user.email}</p>
              <p className="profile-phone">📱 {user.noHp}</p>
              <p className="profile-join-date">
                📅 Bergabung sejak {formatJoinDate(user.tanggalBergabung)}
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
                <TicketCard key={booking._id} ticket={booking} />
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
                  value={user.email}
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
