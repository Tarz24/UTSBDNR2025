# 🚀 Quick Start Guide - Data Management

## ✅ Yang Sudah Dibuat

### 1. **AuthContext** (`src/context/AuthContext.js`)
Context API untuk mengelola autentikasi user secara global.

### 2. **dataManager** (`src/utils/dataManager.js`)
Utility functions untuk CRUD operations dengan localStorage.

### 3. **devTools** (`src/utils/devTools.js`)
Developer console tools untuk testing dan debugging.

### 4. **Dummy Data**
Otomatis di-initialize saat aplikasi pertama kali dijalankan.

---

## 🎯 Cara Testing

### 1. **Buka Browser Console**
```
F12 (Windows) atau Cmd+Opt+I (Mac)
```

### 2. **Lihat Data**
```javascript
// Lihat semua data
BarayaDevTools.viewAllData()

// Lihat users
BarayaDevTools.viewUsers()

// Lihat schedules
BarayaDevTools.viewSchedules()

// Lihat bookings
BarayaDevTools.viewBookings()

// Lihat current user
BarayaDevTools.viewCurrentUser()
```

### 3. **Quick Login**
```javascript
// Login as user
BarayaDevTools.loginAsAhmad()   // User: Ahmad Fadli
BarayaDevTools.loginAsSiti()    // User: Siti Nurhaliza
BarayaDevTools.loginAsBudi()    // User: Budi Santoso

// Login as admin
BarayaDevTools.loginAsAdmin()   // Admin: Admin Baraya
```

### 4. **Logout**
```javascript
BarayaDevTools.logout()
```

### 5. **Reset Data**
```javascript
BarayaDevTools.resetData()  // Clear semua data dan reinitialize
```

---

## 📊 Dummy Data Summary

### Users (4 accounts)
| Name | Email | Password | Role |
|------|-------|----------|------|
| Ahmad Fadli | ahmad@email.com | password123 | user |
| Siti Nurhaliza | siti@email.com | password123 | user |
| Budi Santoso | budi@email.com | password123 | user |
| Admin Baraya | admin@baraya.com | admin123 | admin |

### Schedules (6 routes)
| ID | Route | Date | Price | Available |
|----|-------|------|-------|-----------|
| JDW001 | Jakarta → Surabaya | 2024-01-20 | Rp 250,000 | 35/40 |
| JDW002 | Bandung → Yogyakarta | 2024-01-21 | Rp 200,000 | 28/40 |
| JDW003 | Surabaya → Bali | 2024-01-22 | Rp 300,000 | 40/40 |
| JDW004 | Jakarta → Bali | 2024-01-23 | Rp 350,000 | 15/40 |
| JDW005 | Semarang → Jakarta | 2024-01-24 | Rp 220,000 | 32/40 |
| JDW006 | Yogyakarta → Bali | 2024-01-25 | Rp 280,000 | 25/40 |

### Bookings (5 bookings)
| ID | User | Route | Seats | Total | Status |
|----|------|-------|-------|-------|--------|
| BK001 | Ahmad Fadli | Jakarta → Surabaya | 2 | Rp 500,000 | confirmed |
| BK002 | Siti Nurhaliza | Bandung → Yogyakarta | 1 | Rp 200,000 | pending |
| BK003 | Budi Santoso | Jakarta → Bali | 3 | Rp 1,050,000 | completed |
| BK004 | Ahmad Fadli | Jakarta → Surabaya | 1 | Rp 250,000 | cancelled |
| BK005 | Ahmad Fadli | Surabaya → Bali | 2 | Rp 600,000 | confirmed |

---

## 🔧 Next Steps - Integrasi ke Pages

### 1. **LoginPage** ✅ (Siap diintegrasikan)
```javascript
import { useAuth } from '../../context/AuthContext';

const { login } = useAuth();
const result = login(email, password);
```

### 2. **RegisterPage** ✅ (Siap diintegrasikan)
```javascript
import { useAuth } from '../../context/AuthContext';

const { register } = useAuth();
const result = register(userData);
```

### 3. **Navbar** ✅ (Siap diintegrasikan)
```javascript
import { useAuth } from '../../context/AuthContext';

const { isLoggedIn, currentUser, logout } = useAuth();
```

### 4. **ProfileUserPage** ✅ (Siap diintegrasikan)
```javascript
import { useAuth } from '../../context/AuthContext';

const { currentUser, getUserBookings, updateProfile, changePassword } = useAuth();
```

### 5. **SearchPage** ✅ (Siap diintegrasikan)
```javascript
import { searchSchedules } from '../../utils/dataManager';
import { useAuth } from '../../context/AuthContext';

const schedules = searchSchedules(origin, destination, date);
const { addBooking, isLoggedIn } = useAuth();
```

### 6. **AdminPanelPage** ✅ (Siap diintegrasikan)
```javascript
import { 
  getAllSchedules, 
  getAllBookings, 
  addSchedule, 
  updateSchedule, 
  deleteSchedule 
} from '../../utils/dataManager';
```

---

## 📝 Implementation Priority

1. **LoginPage & RegisterPage** (Highest Priority)
   - Integrate AuthContext
   - Replace dummy login/register with real functionality
   
2. **Navbar** (High Priority)
   - Use real isLoggedIn state
   - Show current user info
   - Implement real logout
   
3. **ProfileUserPage** (Medium Priority)
   - Load real user bookings
   - Implement update profile
   - Implement change password
   
4. **SearchPage** (Medium Priority)
   - Load real schedules
   - Implement real booking
   - Check authentication before booking
   
5. **AdminPanelPage** (Low Priority)
   - Load real data
   - Implement CRUD operations
   - Add role-based access control

---

## ⚠️ Important Notes

1. **localStorage** digunakan untuk development/testing
2. Data akan hilang jika browser cache di-clear
3. Password disimpan plain text (akan di-hash di backend)
4. Semua CRUD operations sudah ada di `dataManager.js`
5. AuthContext sudah wrap di App.js

---

## 🎉 Ready to Integrate!

Sekarang data management sudah siap! Tinggal integrate ke masing-masing page.

**Mau mulai dari page mana?** 
- LoginPage & RegisterPage (Recommended first)
- Navbar
- ProfileUserPage
- SearchPage
- AdminPanelPage

Type `BarayaDevTools.help()` di console untuk melihat semua commands! 🚀
