/**
 * Data Transformer Utility
 * 
 * Purpose: Convert data format between Backend (MongoDB) and Frontend (React)
 * 
 * Backend Format (MongoDB):
 * - User: { nama, email, no_hp, password }
 * - Jadwal: { rute_awal, rute_tujuan, pool_keberangkatan, pool_tujuan, jam_berangkat, harga, total_kursi, kursi_tersedia }
 * - Pemesanan: { kode_booking, user (ref), jadwal (ref), jumlah_penumpang, nomor_kursi, total_harga, status_pembayaran }
 * 
 * Frontend Format (React):
 * - User: { id, namaLengkap, email, noHp, role }
 * - Schedule: { id, origin, destination, date, time, price, seats, availableSeats }
 * - Booking: { id, userId, userName, scheduleId, origin, destination, date, time, seats, selectedSeats, totalPrice, status }
 */

// ==========================================
// BACKEND → FRONTEND TRANSFORMATIONS
// ==========================================

/**
 * Transform User from Backend to Frontend format
 * @param {Object} user - Backend user object
 * @returns {Object} Frontend user object
 */
export const transformUserFromBackend = (user) => {
  if (!user) return null;
  
  return {
    id: user._id || user.id,
    namaLengkap: user.nama,
    email: user.email,
    noHp: user.no_hp,
    password: user.password, // Keep for comparison (hashed)
    role: user.role || 'user',
    createdAt: user.createdAt || user.created_at,
    bookings: []
  };
};

/**
 * Transform Jadwal from Backend to Frontend format
 * @param {Object} jadwal - Backend jadwal object
 * @returns {Object} Frontend schedule object
 */
export const transformScheduleFromBackend = (jadwal) => {
  if (!jadwal) return null;
  
  // Parse jam_berangkat (could be Date object or ISO string)
  const jamBerangkat = new Date(jadwal.jam_berangkat);
  
  // Extract date and time
  const date = jamBerangkat.toISOString().split('T')[0]; // "2025-11-17"
  const time = jamBerangkat.toTimeString().slice(0, 5);  // "08:00"
  
  return {
    id: jadwal._id || jadwal.id,
    origin: `${jadwal.rute_awal}, ${jadwal.pool_keberangkatan}`.toUpperCase(),
    destination: `${jadwal.rute_tujuan}, ${jadwal.pool_tujuan}`.toUpperCase(),
    date: date,
    time: time,
    price: jadwal.harga,
    seats: jadwal.total_kursi,
    availableSeats: jadwal.kursi_tersedia,
    status: 'active', // Backend doesn't have status, assume active
    createdAt: jadwal.createdAt || jadwal.created_at
  };
};

/**
 * Transform Pemesanan from Backend to Frontend format
 * @param {Object} pemesanan - Backend pemesanan object (with populated user & jadwal)
 * @returns {Object} Frontend booking object
 */
export const transformBookingFromBackend = (pemesanan) => {
  if (!pemesanan) return null;
  
  // Handle populated fields (mongoose populate)
  const user = pemesanan.user || {};
  const jadwal = pemesanan.jadwal || {};
  
  // Parse dates
  const jamBerangkat = jadwal.jam_berangkat ? new Date(jadwal.jam_berangkat) : new Date();
  const tanggalPesan = pemesanan.tanggal_pesan ? new Date(pemesanan.tanggal_pesan) : new Date();
  
  return {
    id: pemesanan._id || pemesanan.kode_booking,
    userId: user._id || user.id,
    userName: user.nama,
    userEmail: user.email,
    userPhone: user.no_hp,
    scheduleId: jadwal._id || jadwal.id,
    origin: jadwal.rute_awal && jadwal.pool_keberangkatan 
      ? `${jadwal.rute_awal}, ${jadwal.pool_keberangkatan}`.toUpperCase()
      : '',
    destination: jadwal.rute_tujuan && jadwal.pool_tujuan
      ? `${jadwal.rute_tujuan}, ${jadwal.pool_tujuan}`.toUpperCase()
      : '',
    date: jamBerangkat.toISOString().split('T')[0],
    time: jamBerangkat.toTimeString().slice(0, 5),
    seats: pemesanan.jumlah_penumpang,
    selectedSeats: pemesanan.nomor_kursi.map(seat => Number(seat)), // Convert string[] to number[]
    price: jadwal.harga || 0,
    totalPrice: pemesanan.total_harga,
    status: mapStatusToFrontend(pemesanan.status_pembayaran),
    bookingDate: tanggalPesan.toISOString()
  };
};

// ==========================================
// FRONTEND → BACKEND TRANSFORMATIONS
// ==========================================

/**
 * Transform User from Frontend to Backend format
 * @param {Object} user - Frontend user object
 * @returns {Object} Backend user object
 */
export const transformUserToBackend = (user) => {
  if (!user) return null;
  
  return {
    nama: user.namaLengkap,
    email: user.email,
    no_hp: user.noHp,
    password: user.password // Will be hashed by backend
  };
};

/**
 * Transform Register data from Frontend to Backend format
 * @param {Object} formData - Frontend registration form data
 * @returns {Object} Backend user registration object
 */
export const transformRegisterToBackend = (formData) => {
  return {
    nama: formData.namaLengkap,
    email: formData.email,
    no_hp: formData.noHp,
    password: formData.password
  };
};

/**
 * Transform Schedule from Frontend to Backend format
 * @param {Object} schedule - Frontend schedule object
 * @returns {Object} Backend jadwal object
 */
export const transformScheduleToBackend = (schedule) => {
  if (!schedule) return null;
  
  // Parse origin: "BANDUNG, PASTEUR2" → rute_awal + pool_keberangkatan
  const originParts = schedule.origin.split(',').map(s => s.trim());
  const rute_awal = originParts[0] || '';
  const pool_keberangkatan = originParts[1] || '';
  
  // Parse destination: "JAKARTA SELATAN, TEBET" → rute_tujuan + pool_tujuan
  const destParts = schedule.destination.split(',').map(s => s.trim());
  const rute_tujuan = destParts[0] || '';
  const pool_tujuan = destParts[1] || '';
  
  // Combine date + time into ISO DateTime
  const jam_berangkat = new Date(`${schedule.date}T${schedule.time}:00.000Z`);
  
  // Estimate arrival time (default: 3 hours later)
  // TODO: Calculate based on actual route distance
  const estimasi_jam_tiba = new Date(jam_berangkat);
  estimasi_jam_tiba.setHours(estimasi_jam_tiba.getHours() + 3);
  
  return {
    rute_awal,
    rute_tujuan,
    pool_keberangkatan,
    pool_tujuan,
    jam_berangkat: jam_berangkat.toISOString(),
    estimasi_jam_tiba: estimasi_jam_tiba.toISOString(),
    harga: Number(schedule.price),
    total_kursi: Number(schedule.seats),
    kursi_tersedia: Number(schedule.availableSeats || schedule.seats)
  };
};

/**
 * Transform Booking from Frontend to Backend format
 * @param {Object} booking - Frontend booking object
 * @param {String} userId - MongoDB ObjectId of user
 * @param {String} scheduleId - MongoDB ObjectId of jadwal
 * @returns {Object} Backend pemesanan object
 */
export const transformBookingToBackend = (booking, userId, scheduleId) => {
  if (!booking) return null;
  
  return {
    user: userId,
    jadwal: scheduleId,
    tanggal_pesan: new Date().toISOString(),
    jumlah_penumpang: Number(booking.seats),
    nomor_kursi: booking.selectedSeats.map(seat => String(seat)), // Convert number[] to string[]
    total_harga: Number(booking.totalPrice),
    status_pembayaran: mapStatusToBackend(booking.status || 'pending')
  };
};

// ==========================================
// BATCH TRANSFORMATIONS (for arrays)
// ==========================================

/**
 * Transform array of Users from Backend to Frontend
 * @param {Array} users - Array of backend user objects
 * @returns {Array} Array of frontend user objects
 */
export const transformUsersFromBackend = (users) => {
  if (!Array.isArray(users)) return [];
  return users.map(transformUserFromBackend).filter(Boolean);
};

/**
 * Transform array of Schedules from Backend to Frontend
 * @param {Array} jadwals - Array of backend jadwal objects
 * @returns {Array} Array of frontend schedule objects
 */
export const transformSchedulesFromBackend = (jadwals) => {
  if (!Array.isArray(jadwals)) return [];
  return jadwals.map(transformScheduleFromBackend).filter(Boolean);
};

/**
 * Transform array of Bookings from Backend to Frontend
 * @param {Array} pemesanans - Array of backend pemesanan objects
 * @returns {Array} Array of frontend booking objects
 */
export const transformBookingsFromBackend = (pemesanans) => {
  if (!Array.isArray(pemesanans)) return [];
  return pemesanans.map(transformBookingFromBackend).filter(Boolean);
};

// ==========================================
// STATUS MAPPING HELPERS
// ==========================================

/**
 * Map backend status to frontend status
 * Backend: pending, success, cancelled
 * Frontend: pending, confirmed, completed, cancelled
 * 
 * @param {String} backendStatus - Status from backend
 * @returns {String} Frontend status
 */
const mapStatusToFrontend = (backendStatus) => {
  const statusMap = {
    'pending': 'pending',
    'success': 'confirmed',  // Backend "success" → Frontend "confirmed"
    'cancelled': 'cancelled'
  };
  return statusMap[backendStatus] || backendStatus;
};

/**
 * Map frontend status to backend status
 * Frontend: pending, confirmed, completed, cancelled
 * Backend: pending, success, cancelled
 * 
 * @param {String} frontendStatus - Status from frontend
 * @returns {String} Backend status
 */
const mapStatusToBackend = (frontendStatus) => {
  const statusMap = {
    'pending': 'pending',
    'confirmed': 'success',   // Frontend "confirmed" → Backend "success"
    'completed': 'success',   // Frontend "completed" → Backend "success"
    'cancelled': 'cancelled'
  };
  return statusMap[frontendStatus] || 'pending';
};

// ==========================================
// UTILITY HELPERS
// ==========================================

/**
 * Format price for display (Rupiah)
 * @param {Number} price - Price in number
 * @returns {String} Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

/**
 * Format date for display (Indonesian format)
 * @param {String|Date} dateString - Date string or Date object
 * @returns {String} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('id-ID', options);
};

/**
 * Format time for display (HH:mm)
 * @param {String|Date} dateString - Date string or Date object
 * @returns {String} Formatted time string
 */
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

/**
 * Parse combined location into parts
 * @param {String} location - Format: "KOTA, TERMINAL"
 * @returns {Object} { kota, terminal }
 */
export const parseLocation = (location) => {
  const parts = location.split(',').map(s => s.trim());
  return {
    kota: parts[0] || '',
    terminal: parts[1] || ''
  };
};

/**
 * Combine location parts into string
 * @param {String} kota - City name
 * @param {String} terminal - Terminal/pool name
 * @returns {String} Format: "KOTA, TERMINAL"
 */
export const combineLocation = (kota, terminal) => {
  return `${kota}, ${terminal}`.toUpperCase();
};

// ==========================================
// EXPORTS
// ==========================================

export default {
  // Backend → Frontend
  transformUserFromBackend,
  transformScheduleFromBackend,
  transformBookingFromBackend,
  transformUsersFromBackend,
  transformSchedulesFromBackend,
  transformBookingsFromBackend,
  
  // Frontend → Backend
  transformUserToBackend,
  transformRegisterToBackend,
  transformScheduleToBackend,
  transformBookingToBackend,
  
  // Status Mapping
  mapStatusToFrontend,
  mapStatusToBackend,
  
  // Utilities
  formatPrice,
  formatDate,
  formatTime,
  parseLocation,
  combineLocation
};
