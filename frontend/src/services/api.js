/**
 * API Service Layer
 * 
 * Purpose: HTTP Client untuk komunikasi dengan Backend API
 * Base URL: http://localhost:5000/api
 * 
 * Features:
 * - Axios instance with base configuration
 * - Auto attach JWT token to requests
 * - Global error handling
 * - Auth, Jadwal, dan Pemesanan endpoints
 */

import axios from 'axios';

// ==========================================
// CONFIGURATION
// ==========================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Create axios instance with default config
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

/**
 * Add JWT token to all requests automatically
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

/**
 * Handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      console.error('Access denied: Insufficient permissions');
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }
    
    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// ==========================================
// AUTH API ENDPOINTS
// ==========================================

/**
 * Authentication API
 * Base path: /api/auth
 */
export const authAPI = {
  /**
   * Register new user
   * POST /api/auth/register
   * @param {Object} data - { nama, email, no_hp, password }
   * @returns {Promise} { success, message, user }
   */
  register: (data) => {
    return apiClient.post('/auth/register', data);
  },

  /**
   * Login user
   * POST /api/auth/login
   * @param {Object} credentials - { email, password }
   * @returns {Promise} { success, token, user }
   */
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * Get current user profile
   * GET /api/auth/profile
   * @returns {Promise} { user }
   */
  getProfile: () => {
    return apiClient.get('/auth/profile');
  },

  /**
   * Update user profile
   * PUT /api/auth/profile
   * @param {Object} data - { nama, no_hp }
   * @returns {Promise} { success, message, user }
   */
  updateProfile: (data) => {
    return apiClient.put('/auth/profile', data);
  },

  /**
   * Change password
   * PUT /api/auth/password
   * @param {Object} data - { oldPassword, newPassword }
   * @returns {Promise} { success, message }
   */
  changePassword: (data) => {
    return apiClient.put('/auth/password', data);
  },

  /**
   * Logout user (client-side only)
   * Clears token from localStorage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    return Promise.resolve({ success: true });
  }
};

// ==========================================
// JADWAL API ENDPOINTS
// ==========================================

/**
 * Jadwal (Schedule) API
 * Base path: /api/jadwal
 * 
 * Backend routes structure:
 * GET    /jadwal           - Get all jadwal (admin only)
 * GET    /jadwal/active    - Get active jadwal (public)
 * GET    /jadwal/search    - Search jadwal (public)
 * GET    /jadwal/:id       - Get single jadwal (public)
 * POST   /jadwal           - Create jadwal (admin only)
 * PATCH  /jadwal/:id       - Update jadwal (admin only)
 * DELETE /jadwal/:id       - Delete jadwal (admin only)
 */
export const jadwalAPI = {
  /**
   * Get all jadwal (admin only)
   * GET /api/jadwal
   * @returns {Promise} Array of jadwal objects
   */
  getAll: () => {
    return apiClient.get('/jadwal');
  },

  /**
   * Get active jadwal only (available for booking)
   * GET /api/jadwal/active
   * @returns {Promise} Array of active jadwal
   */
  getActive: () => {
    return apiClient.get('/jadwal/active');
  },

  /**
   * Search jadwal by origin, destination, and date
   * GET /api/jadwal/search
   * @param {Object} params - { origin, destination, date }
   * @example
   * search({ 
   *   origin: 'BANDUNG', 
   *   destination: 'JAKARTA', 
   *   date: '2025-11-17' 
   * })
   * @returns {Promise} Array of matching jadwal
   */
  search: (params) => {
    return apiClient.get('/jadwal/search', { params });
  },

  /**
   * Get single jadwal by ID
   * GET /api/jadwal/:id
   * @param {String} id - Jadwal MongoDB ObjectId
   * @returns {Promise} Single jadwal object
   */
  getById: (id) => {
    return apiClient.get(`/jadwal/${id}`);
  },

  /**
   * Create new jadwal (admin only)
   * POST /api/jadwal
   * @param {Object} data - Jadwal data
   * @example
   * {
   *   rute_awal: "BANDUNG",
   *   rute_tujuan: "JAKARTA SELATAN",
   *   pool_keberangkatan: "PASTEUR2",
   *   pool_tujuan: "TEBET",
   *   jam_berangkat: "2025-11-17T08:00:00.000Z",
   *   estimasi_jam_tiba: "2025-11-17T11:00:00.000Z",
   *   harga: 113000,
   *   total_kursi: 20,
   *   kursi_tersedia: 20
   * }
   * @returns {Promise} Created jadwal object
   */
  create: (data) => {
    return apiClient.post('/jadwal', data);
  },

  /**
   * Update jadwal (admin only)
   * PATCH /api/jadwal/:id
   * @param {String} id - Jadwal MongoDB ObjectId
   * @param {Object} data - Updated jadwal data
   * @returns {Promise} Updated jadwal object
   */
  update: (id, data) => {
    return apiClient.patch(`/jadwal/${id}`, data);
  },

  /**
   * Delete jadwal (admin only)
   * DELETE /api/jadwal/:id
   * @param {String} id - Jadwal MongoDB ObjectId
   * @returns {Promise} { success, message }
   */
  delete: (id) => {
    return apiClient.delete(`/jadwal/${id}`);
  }
};

// ==========================================
// PEMESANAN API ENDPOINTS
// ==========================================

/**
 * Pemesanan (Booking) API
 * Base path: /api/pemesanan
 * 
 * Backend routes structure:
 * GET    /pemesanan           - Get all pemesanan (admin only)
 * GET    /pemesanan/user      - Get user's pemesanan (authenticated user)
 * GET    /pemesanan/:id       - Get single pemesanan
 * POST   /pemesanan           - Create pemesanan
 * PATCH  /pemesanan/:id/status - Update pemesanan status (admin only)
 * DELETE /pemesanan/:id       - Cancel pemesanan
 */
export const pemesananAPI = {
  /**
   * Get all pemesanan (admin only)
   * GET /api/pemesanan
   * @returns {Promise} Array of pemesanan objects (with populated user & jadwal)
   */
  getAll: () => {
    return apiClient.get('/pemesanan');
  },

  /**
   * Get current user's pemesanan
   * GET /api/pemesanan/user
   * @returns {Promise} Array of user's pemesanan
   */
  getUserBookings: () => {
    return apiClient.get('/pemesanan/user');
  },

  /**
   * Get single pemesanan by ID
   * GET /api/pemesanan/:id
   * @param {String} id - Pemesanan MongoDB ObjectId
   * @returns {Promise} Single pemesanan object (with populated user & jadwal)
   */
  getById: (id) => {
    return apiClient.get(`/pemesanan/${id}`);
  },

  /**
   * Create new pemesanan
   * POST /api/pemesanan
   * @param {Object} data - Pemesanan data
   * @example
   * {
   *   user: "507f1f77bcf86cd799439011",        // MongoDB ObjectId
   *   jadwal: "507f191e810c19729de860ea",      // MongoDB ObjectId
   *   tanggal_pesan: "2025-11-24T10:30:00.000Z",
   *   jumlah_penumpang: 2,
   *   nomor_kursi: ["5", "6"],                  // Array of strings
   *   total_harga: 226000,
   *   status_pembayaran: "pending"              // pending | success | cancelled
   * }
   * @returns {Promise} Created pemesanan object
   */
  create: (data) => {
    return apiClient.post('/pemesanan', data);
  },

  /**
   * Update pemesanan status (admin only)
   * PATCH /api/pemesanan/:id/status
   * @param {String} id - Pemesanan MongoDB ObjectId
   * @param {String} status - New status (pending | success | cancelled)
   * @returns {Promise} Updated pemesanan object
   */
  updateStatus: (id, status) => {
    return apiClient.patch(`/pemesanan/${id}/status`, { status_pembayaran: status });
  },

  /**
   * Cancel pemesanan
   * DELETE /api/pemesanan/:id
   * @param {String} id - Pemesanan MongoDB ObjectId
   * @returns {Promise} { success, message }
   */
  cancel: (id) => {
    return apiClient.delete(`/pemesanan/${id}`);
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if user is authenticated
 * @returns {Boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get current user from localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing current user:', error);
    return null;
  }
};

/**
 * Set current user in localStorage
 * @param {Object} user - User object
 */
export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

// ==========================================
// EXPORTS
// ==========================================

export default {
  authAPI,
  jadwalAPI,
  pemesananAPI,
  isAuthenticated,
  getCurrentUser,
  setCurrentUser,
  clearAuth
};
