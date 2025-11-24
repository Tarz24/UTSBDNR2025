import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, isAuthenticated } from '../services/api';
import { transformUserFromBackend, transformUserToBackend } from '../utils/dataTransformer';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize: Check token and verify auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          // Verify token by fetching profile
          const response = await authAPI.getProfile();
          if (response.success && response.data) {
            const user = transformUserFromBackend(response.data);
            setCurrentUser(user);
            setIsLoggedIn(true);
          } else {
            // Token invalid, clear auth
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Error verifying auth:', error);
        // Token invalid, clear auth
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Transform data to backend format
      const backendData = transformUserToBackend(userData);
      
      // Call backend API
      const response = await authAPI.register(backendData);
      
      if (response.success) {
        return { 
          success: true, 
          message: response.message || 'Registrasi berhasil!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Registrasi gagal!' 
        };
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Terjadi kesalahan saat registrasi' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Call backend API
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        // Transform user data from backend
        const user = transformUserFromBackend(response.data.user);
        
        // Store current user (token already handled by authAPI.login)
        setCurrentUser(user);
        setIsLoggedIn(true);
        localStorage.setItem('currentUser', JSON.stringify(user));

        return { 
          success: true, 
          message: response.message || 'Login berhasil!', 
          user 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login gagal!' 
        };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Terjadi kesalahan saat login' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Call backend API (optional, backend may not have logout endpoint)
      await authAPI.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local state and storage
      setCurrentUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      
      // Transform data to backend format
      const backendData = transformUserToBackend(updates);
      
      // Call backend API
      const response = await authAPI.updateProfile(backendData);
      
      if (response.success && response.data) {
        // Transform updated user data from backend
        const updatedUser = transformUserFromBackend(response.data);
        
        // Update local state
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        return { 
          success: true, 
          message: response.message || 'Profile berhasil diupdate!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Gagal update profile!' 
        };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Terjadi kesalahan saat update profile' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      
      // Call backend API
      const response = await authAPI.changePassword(oldPassword, newPassword);
      
      if (response.success) {
        return { 
          success: true, 
          message: response.message || 'Password berhasil diubah!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Gagal ubah password!' 
        };
      }
    } catch (error) {
      console.error('Error changing password:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Terjadi kesalahan saat ubah password' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Get user bookings - Now handled by dataManager, kept for backward compatibility
  const getUserBookings = async () => {
    console.warn('getUserBookings from AuthContext is deprecated. Use dataManager.getUserBookings() instead.');
    try {
      // Import dynamically to avoid circular dependency
      const { getUserBookings } = await import('../utils/dataManager');
      return await getUserBookings();
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  };

  // Add booking for user - Now handled by dataManager, kept for backward compatibility
  const addBooking = async (bookingData) => {
    console.warn('addBooking from AuthContext is deprecated. Use dataManager.addBooking() instead.');
    try {
      // Import dynamically to avoid circular dependency
      const { addBooking } = await import('../utils/dataManager');
      
      if (!currentUser?.id) {
        return { success: false, message: 'User tidak terautentikasi!' };
      }

      // dataManager.addBooking requires userId and scheduleId
      const result = await addBooking(bookingData, currentUser.id, bookingData.scheduleId);
      return result;
    } catch (error) {
      console.error('Error adding booking:', error);
      return { success: false, message: 'Terjadi kesalahan saat booking' };
    }
  };

  const value = {
    currentUser,
    isLoggedIn,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    getUserBookings,
    addBooking
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
