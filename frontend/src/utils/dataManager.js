/**
 * Data Manager Utility
 * 
 * Purpose: Business logic layer untuk manage data
 * Menggunakan Backend API + Data Transformer
 * 
 * Changes from localStorage to API:
 * - All functions now return Promises (async)
 * - Data format automatically transformed by dataTransformer
 * - Components tetap pakai format frontend yang sama
 */

import { jadwalAPI, pemesananAPI } from '../services/api';
import {
  transformScheduleFromBackend,
  transformSchedulesFromBackend,
  transformScheduleToBackend,
  transformBookingFromBackend,
  transformBookingsFromBackend,
  transformBookingToBackend
} from './dataTransformer';

// ==========================================
// LEGACY FUNCTIONS (Not used with backend)
// ==========================================

/**
 * Initialize dummy data in localStorage
 * NOTE: Tidak diperlukan saat pakai backend
 * Data akan diambil langsung dari MongoDB
 */
export const initializeDummyData = () => {
  console.warn('⚠️ initializeDummyData() tidak diperlukan saat menggunakan backend API');
  console.log('💡 Data akan diambil langsung dari MongoDB database');
  
  // Dummy Users for reference only
  const dummyUsers = [
    {
      id: 'USER001',
      namaLengkap: 'Ahmad Fadli',
      email: 'ahmad@email.com',
      noHp: '081234567890',
      password: 'password123',
      role: 'user',
      createdAt: '2024-01-10T08:00:00.000Z',
      bookings: []
    },
    {
      id: 'USER002',
      namaLengkap: 'Siti Nurhaliza',
      email: 'siti@email.com',
      noHp: '081234567891',
      password: 'password123',
      role: 'user',
      createdAt: '2024-01-11T09:00:00.000Z',
      bookings: []
    },
    {
      id: 'USER003',
      namaLengkap: 'Budi Santoso',
      email: 'budi@email.com',
      noHp: '081234567892',
      password: 'password123',
      role: 'user',
      createdAt: '2024-01-12T10:00:00.000Z',
      bookings: []
    },
    {
      id: 'ADMIN001',
      namaLengkap: 'Admin Baraya',
      email: 'admin@baraya.com',
      noHp: '081234567899',
      password: 'admin123',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z',
      bookings: []
    }
  ];

  // Dummy Schedules
  const dummySchedules = [
    {
      id: 'JDW001',
      origin: 'BANDUNG, PASTEUR2',
      destination: 'JAKARTA SELATAN, TEBET',
      date: '2025-11-17',
      time: '08:00',
      price: 113000,
      seats: 20,
      availableSeats: 12,
      status: 'active',
      createdAt: '2024-01-05T08:00:00.000Z'
    },
    {
      id: 'JDW002',
      origin: 'BANDUNG, PASTEUR2',
      destination: 'JAKARTA SELATAN, TEBET',
      date: '2025-11-17',
      time: '14:00',
      price: 113000,
      seats: 20,
      availableSeats: 8,
      status: 'active',
      createdAt: '2024-01-05T09:00:00.000Z'
    },
    {
      id: 'JDW003',
      origin: 'JAKARTA SELATAN, TEBET',
      destination: 'BANDUNG, PASTEUR2',
      date: '2025-11-18',
      time: '09:00',
      price: 113000,
      seats: 20,
      availableSeats: 15,
      status: 'active',
      createdAt: '2024-01-05T10:00:00.000Z'
    },
    {
      id: 'JDW004',
      origin: 'JAKARTA SELATAN, TEBET',
      destination: 'BANDUNG, PASTEUR2',
      date: '2025-11-18',
      time: '16:00',
      price: 113000,
      seats: 20,
      availableSeats: 5,
      status: 'active',
      createdAt: '2024-01-05T07:00:00.000Z'
    },
    {
      id: 'JDW005',
      origin: 'JAKARTA PUSAT, SARINAH',
      destination: 'PURWAKARTA, KM72B',
      date: '2025-11-19',
      time: '10:00',
      price: 85000,
      seats: 20,
      availableSeats: 18,
      status: 'active',
      createdAt: '2024-01-05T06:00:00.000Z'
    },
    {
      id: 'JDW006',
      origin: 'PURWAKARTA, KM72B',
      destination: 'JAKARTA SELATAN, KUNINGAN',
      date: '2025-11-25',
      time: '11:00',
      price: 90000,
      seats: 20,
      availableSeats: 10,
      status: 'active',
      createdAt: '2024-01-05T11:00:00.000Z'
    }
  ];

  // Dummy Bookings
  const dummyBookings = [
    {
      id: 'BK001',
      userId: 'USER001',
      userName: 'Ahmad Fadli',
      userEmail: 'ahmad@email.com',
      userPhone: '081234567890',
      scheduleId: 'JDW001',
      origin: 'BANDUNG, PASTEUR2',
      destination: 'JAKARTA SELATAN, TEBET',
      date: '2025-11-17',
      time: '08:00',
      seats: 2,
      selectedSeats: [5, 6],
      price: 113000,
      totalPrice: 226000,
      status: 'confirmed',
      bookingDate: '2024-01-15T10:30:00.000Z'
    },
    {
      id: 'BK002',
      userId: 'USER002',
      userName: 'Siti Nurhaliza',
      userEmail: 'siti@email.com',
      userPhone: '081234567891',
      scheduleId: 'JDW003',
      origin: 'JAKARTA SELATAN, TEBET',
      destination: 'BANDUNG, PASTEUR2',
      date: '2025-11-18',
      time: '09:00',
      seats: 1,
      selectedSeats: [8],
      price: 113000,
      totalPrice: 113000,
      status: 'pending',
      bookingDate: '2024-01-16T11:20:00.000Z'
    },
    {
      id: 'BK003',
      userId: 'USER003',
      userName: 'Budi Santoso',
      userEmail: 'budi@email.com',
      userPhone: '081234567892',
      scheduleId: 'JDW002',
      origin: 'BANDUNG, PASTEUR2',
      destination: 'JAKARTA SELATAN, TEBET',
      date: '2025-11-17',
      time: '14:00',
      seats: 3,
      selectedSeats: [1, 2, 4],
      price: 113000,
      totalPrice: 339000,
      status: 'completed',
      bookingDate: '2024-01-14T14:15:00.000Z'
    },
    {
      id: 'BK004',
      userId: 'USER001',
      userName: 'Ahmad Fadli',
      userEmail: 'ahmad@email.com',
      userPhone: '081234567890',
      scheduleId: 'JDW004',
      origin: 'JAKARTA SELATAN, TEBET',
      destination: 'BANDUNG, PASTEUR2',
      date: '2025-11-18',
      time: '16:00',
      seats: 1,
      selectedSeats: [10],
      price: 113000,
      totalPrice: 113000,
      status: 'cancelled',
      bookingDate: '2024-01-15T09:00:00.000Z'
    },
    {
      id: 'BK005',
      userId: 'USER001',
      userName: 'Ahmad Fadli',
      userEmail: 'ahmad@email.com',
      userPhone: '081234567890',
      scheduleId: 'JDW005',
      origin: 'JAKARTA PUSAT, SARINAH',
      destination: 'PURWAKARTA, KM72B',
      date: '2025-11-25',
      time: '10:00',
      seats: 2,
      selectedSeats: [3, 4],
      price: 85000,
      totalPrice: 170000,
      status: 'confirmed',
      bookingDate: '2024-11-16T08:30:00.000Z'
    }
  ];

  console.log('ℹ️ Dummy data reference (for development only)');
  console.log('👤 Users:', dummyUsers.length);
  console.log('📅 Schedules:', dummySchedules.length);
  console.log('🎫 Bookings:', dummyBookings.length);
};

/**
 * Clear all data
 * NOTE: Sekarang hanya clear localStorage token/cache
 * Backend data tidak terpengaruh
 */
export const clearAllData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  console.log('🗑️ Local cache cleared! (Backend data tetap aman di database)');
};

/**
 * Get all users
 * NOTE: Fungsi ini untuk admin saja, harus melalui Admin API
 * @returns {Promise<Array>} Array of users
 */
export const getAllUsers = async () => {
  console.warn('⚠️ getAllUsers() sekarang harus melalui Admin API endpoint');
  return [];
};

// ==========================================
// SCHEDULES API
// ==========================================

/**
 * Get all schedules (ADMIN only)
 * @returns {Promise<Array>} Array of schedules in frontend format
 */
export const getAllSchedules = async () => {
  try {
    const response = await jadwalAPI.getAll();
    return transformSchedulesFromBackend(response.data);
  } catch (error) {
    console.error('Error getting schedules:', error);
    return [];
  }
};

/**
 * Get active schedules (available for booking)
 * Public endpoint - tidak perlu login
 * @returns {Promise<Array>} Array of active schedules
 */
export const getActiveSchedules = async () => {
  try {
    const response = await jadwalAPI.getActive();
    return transformSchedulesFromBackend(response.data);
  } catch (error) {
    console.error('Error getting active schedules:', error);
    return [];
  }
};

/**
 * Search schedules by origin, destination, and date
 * Public endpoint - tidak perlu login
 * @param {String} origin - Origin location (e.g., "BANDUNG")
 * @param {String} destination - Destination location (e.g., "JAKARTA")
 * @param {String} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of matching schedules
 */
export const searchSchedules = async (origin, destination, date) => {
  try {
    const params = {};
    if (origin) params.origin = origin;
    if (destination) params.destination = destination;
    if (date) params.date = date;
    
    const response = await jadwalAPI.search(params);
    return transformSchedulesFromBackend(response.data);
  } catch (error) {
    console.error('Error searching schedules:', error);
    return [];
  }
};

/**
 * Get schedule by ID
 * @param {String} scheduleId - MongoDB ObjectId
 * @returns {Promise<Object|null>} Single schedule object
 */
export const getScheduleById = async (scheduleId) => {
  try {
    const response = await jadwalAPI.getById(scheduleId);
    return transformScheduleFromBackend(response.data);
  } catch (error) {
    console.error('Error getting schedule:', error);
    return null;
  }
};

/**
 * Add new schedule (ADMIN only)
 * @param {Object} scheduleData - Schedule data in frontend format
 * @returns {Promise<Object>} { success, message, schedule }
 */
export const addSchedule = async (scheduleData) => {
  try {
    // Transform frontend format to backend format
    const backendData = transformScheduleToBackend(scheduleData);
    
    const response = await jadwalAPI.create(backendData);
    const newSchedule = transformScheduleFromBackend(response.data);
    
    return { 
      success: true, 
      message: 'Jadwal berhasil ditambahkan!', 
      schedule: newSchedule 
    };
  } catch (error) {
    console.error('Error adding schedule:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Terjadi kesalahan saat tambah jadwal' 
    };
  }
};

/**
 * Update schedule (ADMIN only)
 * @param {String} scheduleId - MongoDB ObjectId
 * @param {Object} updates - Updated data in frontend format
 * @returns {Promise<Object>} { success, message }
 */
export const updateSchedule = async (scheduleId, updates) => {
  try {
    // Transform frontend format to backend format
    const backendUpdates = transformScheduleToBackend(updates);
    
    await jadwalAPI.update(scheduleId, backendUpdates);
    
    return { 
      success: true, 
      message: 'Jadwal berhasil diupdate!' 
    };
  } catch (error) {
    console.error('Error updating schedule:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Terjadi kesalahan saat update jadwal' 
    };
  }
};

/**
 * Delete schedule (ADMIN only)
 * @param {String} scheduleId - MongoDB ObjectId
 * @returns {Promise<Object>} { success, message }
 */
export const deleteSchedule = async (scheduleId) => {
  try {
    await jadwalAPI.delete(scheduleId);
    
    return { 
      success: true, 
      message: 'Jadwal berhasil dihapus!' 
    };
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Terjadi kesalahan saat hapus jadwal' 
    };
  }
};

// ==========================================
// BOOKINGS API
// ==========================================

/**
 * Get all bookings (ADMIN only)
 * @returns {Promise<Array>} Array of bookings in frontend format
 */
export const getAllBookings = async () => {
  try {
    const response = await pemesananAPI.getAll();
    return transformBookingsFromBackend(response.data);
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
};

/**
 * Get user's bookings (authenticated user)
 * @returns {Promise<Array>} Array of user's bookings
 */
export const getUserBookings = async () => {
  try {
    const response = await pemesananAPI.getUserBookings();
    return transformBookingsFromBackend(response.data);
  } catch (error) {
    console.error('Error getting user bookings:', error);
    return [];
  }
};

/**
 * Add new booking
 * @param {Object} bookingData - Booking data in frontend format
 * @param {String} userId - MongoDB ObjectId of user
 * @param {String} scheduleId - MongoDB ObjectId of jadwal
 * @returns {Promise<Object>} { success, message, booking }
 */
export const addBooking = async (bookingData, userId, scheduleId) => {
  try {
    // Transform frontend format to backend format
    const backendData = transformBookingToBackend(bookingData, userId, scheduleId);
    
    const response = await pemesananAPI.create(backendData);
    const newBooking = transformBookingFromBackend(response.data);
    
    return { 
      success: true, 
      message: 'Booking berhasil dibuat!', 
      booking: newBooking 
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Terjadi kesalahan saat membuat booking' 
    };
  }
};

/**
 * Update booking status (ADMIN only)
 * @param {String} bookingId - MongoDB ObjectId
 * @param {String} newStatus - New status (pending/confirmed/completed/cancelled)
 * @returns {Promise<Object>} { success, message }
 */
export const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    // Transformer will handle status mapping (confirmed/completed → success)
    await pemesananAPI.updateStatus(bookingId, newStatus);
    
    return { 
      success: true, 
      message: 'Status booking berhasil diupdate!' 
    };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Terjadi kesalahan saat update status' 
    };
  }
};

/**
 * Cancel booking
 * @param {String} bookingId - MongoDB ObjectId
 * @returns {Promise<Object>} { success, message }
 */
export const cancelBooking = async (bookingId) => {
  try {
    await pemesananAPI.cancel(bookingId);
    
    return { 
      success: true, 
      message: 'Booking berhasil dibatalkan!' 
    };
  } catch (error) {
    console.error('Error canceling booking:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Terjadi kesalahan saat membatalkan booking' 
    };
  }
};

// ==========================================
// EXPORTS
// ==========================================

export default {
  // Legacy functions
  initializeDummyData,
  clearAllData,
  getAllUsers,
  
  // Schedules
  getAllSchedules,
  getActiveSchedules,
  searchSchedules,
  getScheduleById,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  
  // Bookings
  getAllBookings,
  getUserBookings,
  addBooking,
  updateBookingStatus,
  cancelBooking
};
