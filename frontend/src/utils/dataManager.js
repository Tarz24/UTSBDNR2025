// Initialize dummy data in localStorage
export const initializeDummyData = () => {
  // Check if data already exists
  if (localStorage.getItem('dataInitialized') === 'true') {
    return;
  }

  // Dummy Users
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
      origin: 'Jakarta',
      destination: 'Surabaya',
      date: '2024-01-20',
      time: '08:00',
      price: 250000,
      seats: 40,
      availableSeats: 35,
      status: 'active',
      createdAt: '2024-01-05T08:00:00.000Z'
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
      status: 'active',
      createdAt: '2024-01-05T09:00:00.000Z'
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
      status: 'active',
      createdAt: '2024-01-05T10:00:00.000Z'
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
      status: 'active',
      createdAt: '2024-01-05T07:00:00.000Z'
    },
    {
      id: 'JDW005',
      origin: 'Semarang',
      destination: 'Jakarta',
      date: '2024-01-24',
      time: '06:00',
      price: 220000,
      seats: 40,
      availableSeats: 32,
      status: 'active',
      createdAt: '2024-01-05T06:00:00.000Z'
    },
    {
      id: 'JDW006',
      origin: 'Yogyakarta',
      destination: 'Bali',
      date: '2024-01-25',
      time: '11:00',
      price: 280000,
      seats: 40,
      availableSeats: 25,
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
      origin: 'Jakarta',
      destination: 'Surabaya',
      date: '2024-01-20',
      time: '08:00',
      seats: 2,
      price: 250000,
      totalPrice: 500000,
      status: 'confirmed',
      bookingDate: '2024-01-15T10:30:00.000Z'
    },
    {
      id: 'BK002',
      userId: 'USER002',
      userName: 'Siti Nurhaliza',
      userEmail: 'siti@email.com',
      userPhone: '081234567891',
      scheduleId: 'JDW002',
      origin: 'Bandung',
      destination: 'Yogyakarta',
      date: '2024-01-21',
      time: '09:00',
      seats: 1,
      price: 200000,
      totalPrice: 200000,
      status: 'pending',
      bookingDate: '2024-01-16T11:20:00.000Z'
    },
    {
      id: 'BK003',
      userId: 'USER003',
      userName: 'Budi Santoso',
      userEmail: 'budi@email.com',
      userPhone: '081234567892',
      scheduleId: 'JDW004',
      origin: 'Jakarta',
      destination: 'Bali',
      date: '2024-01-23',
      time: '07:00',
      seats: 3,
      price: 350000,
      totalPrice: 1050000,
      status: 'completed',
      bookingDate: '2024-01-14T14:15:00.000Z'
    },
    {
      id: 'BK004',
      userId: 'USER001',
      userName: 'Ahmad Fadli',
      userEmail: 'ahmad@email.com',
      userPhone: '081234567890',
      scheduleId: 'JDW001',
      origin: 'Jakarta',
      destination: 'Surabaya',
      date: '2024-01-20',
      time: '08:00',
      seats: 1,
      price: 250000,
      totalPrice: 250000,
      status: 'cancelled',
      bookingDate: '2024-01-15T09:00:00.000Z'
    },
    {
      id: 'BK005',
      userId: 'USER001',
      userName: 'Ahmad Fadli',
      userEmail: 'ahmad@email.com',
      userPhone: '081234567890',
      scheduleId: 'JDW003',
      origin: 'Surabaya',
      destination: 'Bali',
      date: '2024-01-22',
      time: '10:00',
      seats: 2,
      price: 300000,
      totalPrice: 600000,
      status: 'confirmed',
      bookingDate: '2024-01-17T08:30:00.000Z'
    }
  ];

  // Save to localStorage
  localStorage.setItem('users', JSON.stringify(dummyUsers));
  localStorage.setItem('schedules', JSON.stringify(dummySchedules));
  localStorage.setItem('bookings', JSON.stringify(dummyBookings));
  localStorage.setItem('dataInitialized', 'true');

  console.log('✅ Dummy data initialized successfully!');
  console.log('👤 Users:', dummyUsers.length);
  console.log('📅 Schedules:', dummySchedules.length);
  console.log('🎫 Bookings:', dummyBookings.length);
};

// Clear all data (for testing)
export const clearAllData = () => {
  localStorage.removeItem('users');
  localStorage.removeItem('schedules');
  localStorage.removeItem('bookings');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('dataInitialized');
  console.log('🗑️ All data cleared!');
};

// Get all users
export const getAllUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('users') || '[]');
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Get all schedules
export const getAllSchedules = () => {
  try {
    return JSON.parse(localStorage.getItem('schedules') || '[]');
  } catch (error) {
    console.error('Error getting schedules:', error);
    return [];
  }
};

// Get all bookings
export const getAllBookings = () => {
  try {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
};

// Get active schedules (available for booking)
export const getActiveSchedules = () => {
  const schedules = getAllSchedules();
  const today = new Date().toISOString().split('T')[0];
  
  return schedules.filter(schedule => 
    schedule.status === 'active' && 
    schedule.date >= today &&
    schedule.availableSeats > 0
  );
};

// Search schedules
export const searchSchedules = (origin, destination, date) => {
  const schedules = getActiveSchedules();
  
  return schedules.filter(schedule => {
    const matchOrigin = !origin || schedule.origin.toLowerCase().includes(origin.toLowerCase());
    const matchDestination = !destination || schedule.destination.toLowerCase().includes(destination.toLowerCase());
    const matchDate = !date || schedule.date === date;
    
    return matchOrigin && matchDestination && matchDate;
  });
};

// Get schedule by ID
export const getScheduleById = (scheduleId) => {
  const schedules = getAllSchedules();
  return schedules.find(schedule => schedule.id === scheduleId);
};

// Update schedule
export const updateSchedule = (scheduleId, updates) => {
  try {
    const schedules = getAllSchedules();
    const index = schedules.findIndex(s => s.id === scheduleId);
    
    if (index === -1) {
      return { success: false, message: 'Jadwal tidak ditemukan!' };
    }

    schedules[index] = {
      ...schedules[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('schedules', JSON.stringify(schedules));
    return { success: true, message: 'Jadwal berhasil diupdate!' };
  } catch (error) {
    console.error('Error updating schedule:', error);
    return { success: false, message: 'Terjadi kesalahan saat update jadwal' };
  }
};

// Delete schedule
export const deleteSchedule = (scheduleId) => {
  try {
    const schedules = getAllSchedules();
    const filteredSchedules = schedules.filter(s => s.id !== scheduleId);
    
    localStorage.setItem('schedules', JSON.stringify(filteredSchedules));
    return { success: true, message: 'Jadwal berhasil dihapus!' };
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return { success: false, message: 'Terjadi kesalahan saat hapus jadwal' };
  }
};

// Add schedule
export const addSchedule = (scheduleData) => {
  try {
    const schedules = getAllSchedules();
    
    const newSchedule = {
      id: `JDW${String(schedules.length + 1).padStart(3, '0')}`,
      ...scheduleData,
      availableSeats: scheduleData.seats,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    schedules.push(newSchedule);
    localStorage.setItem('schedules', JSON.stringify(schedules));
    
    return { success: true, message: 'Jadwal berhasil ditambahkan!', schedule: newSchedule };
  } catch (error) {
    console.error('Error adding schedule:', error);
    return { success: false, message: 'Terjadi kesalahan saat tambah jadwal' };
  }
};

// Update booking status
export const updateBookingStatus = (bookingId, newStatus) => {
  try {
    const bookings = getAllBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    
    if (index === -1) {
      return { success: false, message: 'Booking tidak ditemukan!' };
    }

    bookings[index].status = newStatus;
    bookings[index].updatedAt = new Date().toISOString();

    localStorage.setItem('bookings', JSON.stringify(bookings));
    return { success: true, message: 'Status booking berhasil diupdate!' };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, message: 'Terjadi kesalahan saat update status' };
  }
};

export default {
  initializeDummyData,
  clearAllData,
  getAllUsers,
  getAllSchedules,
  getAllBookings,
  getActiveSchedules,
  searchSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  addSchedule,
  updateBookingStatus
};
