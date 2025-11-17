// Helper functions for testing data in browser console

window.BarayaDevTools = {
  // View all data
  viewAllData: () => {
    console.log('=== 📊 BARAYA TRAVEL - ALL DATA ===\n');
    
    console.log('👥 USERS:', JSON.parse(localStorage.getItem('users') || '[]'));
    console.log('\n📅 SCHEDULES:', JSON.parse(localStorage.getItem('schedules') || '[]'));
    console.log('\n🎫 BOOKINGS:', JSON.parse(localStorage.getItem('bookings') || '[]'));
    console.log('\n👤 CURRENT USER:', JSON.parse(localStorage.getItem('currentUser') || 'null'));
    
    console.log('\n=== 📈 STATISTICS ===');
    console.log('Total Users:', JSON.parse(localStorage.getItem('users') || '[]').length);
    console.log('Total Schedules:', JSON.parse(localStorage.getItem('schedules') || '[]').length);
    console.log('Total Bookings:', JSON.parse(localStorage.getItem('bookings') || '[]').length);
  },

  // View users only
  viewUsers: () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.table(users.map(u => ({
      ID: u.id,
      Name: u.namaLengkap,
      Email: u.email,
      Phone: u.noHp,
      Role: u.role
    })));
  },

  // View schedules only
  viewSchedules: () => {
    const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
    console.table(schedules.map(s => ({
      ID: s.id,
      Route: `${s.origin} → ${s.destination}`,
      Date: s.date,
      Time: s.time,
      Price: s.price,
      Available: `${s.availableSeats}/${s.seats}`,
      Status: s.status
    })));
  },

  // View bookings only
  viewBookings: () => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    console.table(bookings.map(b => ({
      ID: b.id,
      User: b.userName,
      Route: `${b.origin} → ${b.destination}`,
      Date: b.date,
      Seats: b.seats,
      Total: `Rp ${b.totalPrice.toLocaleString()}`,
      Status: b.status
    })));
  },

  // View current user
  viewCurrentUser: () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (user) {
      console.log('👤 Current User:', user);
    } else {
      console.log('❌ No user logged in');
    }
  },

  // Clear all data and reinitialize
  resetData: () => {
    if (window.confirm('⚠️ This will delete all data and reinitialize dummy data. Continue?')) {
      localStorage.clear();
      window.location.reload();
      console.log('✅ Data reset complete! Page will reload...');
    }
  },

  // Clear only current session
  logout: () => {
    localStorage.removeItem('currentUser');
    console.log('✅ Logged out successfully!');
    window.location.reload();
  },

  // Test login
  testLogin: (email = 'ahmad@email.com', password = 'password123') => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userWithoutPassword = {
        id: user.id,
        namaLengkap: user.namaLengkap,
        email: user.email,
        noHp: user.noHp,
        role: user.role,
        createdAt: user.createdAt
      };
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      console.log('✅ Login successful!', userWithoutPassword);
      window.location.reload();
    } else {
      console.error('❌ Login failed! Invalid credentials.');
    }
  },

  // Quick login presets
  loginAsAhmad: () => window.BarayaDevTools.testLogin('ahmad@email.com', 'password123'),
  loginAsSiti: () => window.BarayaDevTools.testLogin('siti@email.com', 'password123'),
  loginAsBudi: () => window.BarayaDevTools.testLogin('budi@email.com', 'password123'),
  loginAsAdmin: () => window.BarayaDevTools.testLogin('admin@baraya.com', 'admin123'),

  // Show help
  help: () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║     🚌 BARAYA TRAVEL - DEVELOPER CONSOLE TOOLS      ║
╚══════════════════════════════════════════════════════╝

📊 VIEW DATA:
  BarayaDevTools.viewAllData()       - View all data
  BarayaDevTools.viewUsers()         - View users table
  BarayaDevTools.viewSchedules()     - View schedules table
  BarayaDevTools.viewBookings()      - View bookings table
  BarayaDevTools.viewCurrentUser()   - View current logged in user

🔐 AUTHENTICATION:
  BarayaDevTools.loginAsAhmad()      - Login as Ahmad Fadli
  BarayaDevTools.loginAsSiti()       - Login as Siti Nurhaliza
  BarayaDevTools.loginAsBudi()       - Login as Budi Santoso
  BarayaDevTools.loginAsAdmin()      - Login as Admin
  BarayaDevTools.logout()            - Logout current user

🔧 UTILITIES:
  BarayaDevTools.resetData()         - Clear & reinitialize data
  BarayaDevTools.help()              - Show this help

📝 DUMMY ACCOUNTS:
  User: ahmad@email.com / password123
  User: siti@email.com / password123
  User: budi@email.com / password123
  Admin: admin@baraya.com / admin123

💡 TIP: Open DevTools > Application > Local Storage to see raw data
    `);
  }
};

// Auto-show help on first load
console.log('%c🚌 BARAYA TRAVEL - Dev Tools Loaded!', 'font-size: 16px; font-weight: bold; color: #667eea;');
console.log('%cType BarayaDevTools.help() to see available commands', 'color: #666;');

export default window.BarayaDevTools;
