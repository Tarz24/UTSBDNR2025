import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Initialize: Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Register new user
  const register = (userData) => {
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      const emailExists = existingUsers.some(user => user.email === userData.email);
      if (emailExists) {
        return { success: false, message: 'Email sudah terdaftar!' };
      }

      // Check if phone already exists
      const phoneExists = existingUsers.some(user => user.noHp === userData.noHp);
      if (phoneExists) {
        return { success: false, message: 'Nomor HP sudah terdaftar!' };
      }

      // Create new user with generated ID
      const newUser = {
        id: `USER${String(existingUsers.length + 1).padStart(3, '0')}`,
        namaLengkap: userData.namaLengkap,
        email: userData.email,
        noHp: userData.noHp,
        password: userData.password, // In production, this should be hashed!
        role: 'user',
        createdAt: new Date().toISOString(),
        bookings: []
      };

      // Add to users array
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      return { success: true, message: 'Registrasi berhasil!' };
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, message: 'Terjadi kesalahan saat registrasi' };
    }
  };

  // Login user
  const login = (email, password) => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user with matching credentials
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, message: 'Email atau password salah!' };
      }

      // Set current user (without password)
      const userWithoutPassword = {
        id: user.id,
        namaLengkap: user.namaLengkap,
        email: user.email,
        noHp: user.noHp,
        role: user.role,
        createdAt: user.createdAt
      };

      setCurrentUser(userWithoutPassword);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return { success: true, message: 'Login berhasil!', user: userWithoutPassword };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, message: 'Terjadi kesalahan saat login' };
    }
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
  };

  // Update user profile
  const updateProfile = (updates) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex === -1) {
        return { success: false, message: 'User tidak ditemukan!' };
      }

      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('users', JSON.stringify(users));

      // Update current user
      const updatedUser = {
        id: users[userIndex].id,
        namaLengkap: users[userIndex].namaLengkap,
        email: users[userIndex].email,
        noHp: users[userIndex].noHp,
        role: users[userIndex].role,
        createdAt: users[userIndex].createdAt
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      return { success: true, message: 'Profile berhasil diupdate!' };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: 'Terjadi kesalahan saat update profile' };
    }
  };

  // Change password
  const changePassword = (oldPassword, newPassword) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex === -1) {
        return { success: false, message: 'User tidak ditemukan!' };
      }

      // Check old password
      if (users[userIndex].password !== oldPassword) {
        return { success: false, message: 'Password lama salah!' };
      }

      // Update password
      users[userIndex].password = newPassword;
      users[userIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('users', JSON.stringify(users));

      return { success: true, message: 'Password berhasil diubah!' };
    } catch (error) {
      console.error('Error changing password:', error);
      return { success: false, message: 'Terjadi kesalahan saat ubah password' };
    }
  };

  // Get user bookings
  const getUserBookings = () => {
    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      return bookings.filter(booking => booking.userId === currentUser?.id);
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  };

  // Add booking for user
  const addBooking = (bookingData) => {
    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      
      const newBooking = {
        id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
        userId: currentUser.id,
        userName: currentUser.namaLengkap,
        userEmail: currentUser.email,
        userPhone: currentUser.noHp,
        ...bookingData,
        status: 'pending',
        bookingDate: new Date().toISOString()
      };

      bookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      return { success: true, message: 'Booking berhasil!', booking: newBooking };
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
