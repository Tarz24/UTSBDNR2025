# 🔄 FLOW APLIKASI BARAYA TRAVEL

## 📋 **Routing Structure**

```
App.js (Router)
├── / (HomePage)
├── /search (SearchPage)
├── /my-ticket (MyTicketPage)
├── /login (LoginPage)
├── /register (RegisterPage)
└── /profile (ProfileUserPage)
```

---

## 🚀 **Alur Navigasi Lengkap**

### **1. HomePage → Search Flow** 🏠➡️🔍
```
HomePage
  └─> User mengisi SearchForm (dari, tujuan, tanggal, penumpang)
      └─> Click "Cari Jadwal"
          └─> navigate('/search', { state: { searchParams } })
              └─> SearchPage (menerima searchParams via location.state)
```

**Implementasi:**
- `HomePage/index.js`: `handleSearch()` → `navigate('/search')`
- Data dikirim via React Router state

---

### **2. SearchPage → Booking Flow** 🔍➡️🎫
```
SearchPage
  ├─> User melihat jadwal pergi
  ├─> User pilih jadwal pergi → setSelectedJadwalPergi()
  ├─> [Jika Pulang-Pergi] User pilih jadwal pulang → setSelectedJadwalPulang()
  └─> Click "Lanjut Booking"
      └─> Validasi jadwal terpilih
          └─> navigate('/my-ticket', { state: { bookingData } })
              └─> MyTicketPage (menerima bookingData via location.state)
```

**Implementasi:**
- `SearchPage/index.js`: `handleLanjutBooking()` → `navigate('/my-ticket')`
- Conditional: Tab pulang hanya muncul jika `isPulangPergi === true`
- Auto-switch ke tab pulang setelah pilih jadwal pergi

---

### **3. MyTicketPage → Profile Flow** 🎫➡️👤
```
MyTicketPage (Konfirmasi Pemesanan)
  ├─> Menampilkan e-ticket yang baru dipesan
  ├─> Button "Download E-Ticket" (placeholder)
  ├─> Button "Print Tiket" → window.print()
  ├─> Button "Kembali ke Beranda" → navigate('/')
  └─> Button "Lihat Semua Tiket" → navigate('/profile')
```

**Implementasi:**
- `MyTicketPage/index.js`: 
  - `handleBackToHome()` → `navigate('/')`
  - `handleViewAllTickets()` → `navigate('/profile')`

---

### **4. Login/Register Flow** 🔐
```
Navbar
  └─> Click "MASUK"
      └─> navigate('/login')
          └─> LoginPage
              ├─> User mengisi email & password
              ├─> Click "Daftar Sekarang" → navigate('/register')
              │   └─> RegisterPage
              │       ├─> User mengisi data lengkap
              │       ├─> Click "Daftar Sekarang"
              │       └─> Sukses → navigate('/login') (suruh login ulang)
              │
              ├─> Click "Masuk"
              │   └─> Validasi → Login Sukses → navigate('/') (HomePage)
              │
              └─> Click "Kembali ke Beranda" → navigate('/')
```

**Implementasi:**
- `Navbar/index.js`: `handleLoginClick()` → `navigate('/login')`
- `LoginPage/index.js`: 
  - `handleRegisterRedirect()` → `navigate('/register')`
  - `handleSubmit()` → Sukses → `navigate('/')`
  - `handleBackToHome()` → `navigate('/')`
- `RegisterPage/index.js`:
  - `handleLoginRedirect()` → `navigate('/login')`
  - `handleSubmit()` → Sukses → `navigate('/login')`
  - `handleBackToHome()` → `navigate('/')`

---

### **5. Profile Flow** 👤
```
ProfileUserPage
  ├─> Menampilkan info user (nama, email, no HP, tanggal bergabung)
  ├─> Statistics cards (total, confirmed, completed, cancelled)
  ├─> Riwayat pemesanan dengan filter tabs
  │
  ├─> Click "Edit Profile"
  │   └─> Modal Edit Profile
  │       ├─> Edit nama lengkap & no HP
  │       └─> Save → Update state → Alert sukses
  │
  ├─> Click "Ganti Password"
  │   └─> Modal Ganti Password
  │       ├─> Input password lama/baru
  │       └─> Save → Alert sukses
  │
  └─> Click "Keluar"
      └─> Confirmation dialog
          └─> Logout → navigate('/') (HomePage)
```

**Implementasi:**
- `ProfileUserPage/index.js`:
  - `handleLogout()` → Confirm → `navigate('/')`
  - Modal edit profile: Local state management
  - Modal ganti password: Local state management

---

### **6. Navbar Dynamic Navigation** 🧭
```
Navbar
  ├─> Logo (Click) → navigate('/')
  ├─> "CEK TIKET" (Click) → navigate('/profile')
  │
  └─> Login State:
      ├─> isLoggedIn === false
      │   └─> Button "MASUK" → navigate('/login')
      │
      └─> isLoggedIn === true
          └─> Button "👤 {userName}" → navigate('/profile')
```

**Implementasi:**
- `Navbar/index.js`:
  - `handleLogoClick()` → `navigate('/')`
  - `handleLoginClick()` → `navigate('/login')`
  - `handleProfileClick()` → `navigate('/profile')`
  - `handleMyTicketsClick()` → `navigate('/profile')`

---

## 📊 **Complete User Journey**

### **Scenario 1: User Baru (Belum Punya Akun)** 👶
```
1. Buka website → HomePage
2. Click "MASUK" di Navbar → LoginPage
3. Click "Daftar Sekarang" → RegisterPage
4. Isi form registrasi → Submit
5. Alert "Pendaftaran berhasil!" → Redirect ke LoginPage
6. Login dengan akun baru → Submit
7. Alert "Login berhasil!" → Redirect ke HomePage (logged in)
8. Isi SearchForm → Click "Cari Jadwal"
9. Pilih jadwal di SearchPage → Click "Lanjut Booking"
10. Lihat e-ticket di MyTicketPage
11. Click "Lihat Semua Tiket" → ProfileUserPage
```

### **Scenario 2: User Existing (Sudah Punya Akun)** 👤
```
1. Buka website → HomePage
2. Click "MASUK" di Navbar → LoginPage
3. Login dengan akun existing → Submit
4. Redirect ke HomePage (logged in)
5. Isi SearchForm → Click "Cari Jadwal"
6. Pilih jadwal di SearchPage → Click "Lanjut Booking"
7. Lihat e-ticket di MyTicketPage
8. Click "Lihat Semua Tiket" → ProfileUserPage
9. Lihat riwayat pemesanan, edit profile, dll
10. Click "Keluar" → Logout → Redirect ke HomePage
```

### **Scenario 3: Browse Without Login** 🔍
```
1. Buka website → HomePage
2. Isi SearchForm → Click "Cari Jadwal"
3. Lihat jadwal di SearchPage
4. Pilih jadwal → Click "Lanjut Booking"
5. [Nanti] Redirect ke LoginPage (butuh login untuk booking)
```

---

## 🔐 **Authentication State (Dummy)**

Saat ini menggunakan dummy state di Navbar:
```javascript
const [isLoggedIn] = useState(false);
const [userName] = useState('Budi Santoso');
```

**Nanti saat integrasi:**
- Ganti dengan `AuthContext`
- Check token di localStorage
- Persist login state
- Protected routes untuk halaman yang butuh login

---

## 📦 **Data Flow via React Router**

### **HomePage → SearchPage**
```javascript
// HomePage
navigate('/search', { 
  state: { 
    searchParams: {
      berangkatDari: 'BANDUNG',
      tujuanKe: 'JAKARTA',
      tanggalPergi: '2025-11-17',
      penumpang: 2,
      isPulangPergi: true
    }
  }
});

// SearchPage
const location = useLocation();
const searchParams = location.state?.searchParams;
```

### **SearchPage → MyTicketPage**
```javascript
// SearchPage
navigate('/my-ticket', {
  state: {
    bookingData: {
      jadwalPergi: selectedJadwalPergi,
      jadwalPulang: selectedJadwalPulang,
      penumpang: searchParams.penumpang,
      totalHarga: calculateTotalPrice()
    }
  }
});

// MyTicketPage
const location = useLocation();
const bookingData = location.state?.bookingData;
```

---

## ✅ **Checklist Integrasi Routing**

✅ App.js - Setup React Router dengan semua routes
✅ Navbar - Navigation ke semua halaman
✅ HomePage - Navigate ke SearchPage dengan search params
✅ SearchPage - Navigate ke MyTicketPage dengan booking data
✅ MyTicketPage - Navigate ke HomePage & ProfileUserPage
✅ LoginPage - Navigate ke RegisterPage, HomePage, back to home
✅ RegisterPage - Navigate ke LoginPage, back to home
✅ ProfileUserPage - Logout navigate ke HomePage

---

## 🚧 **Next Steps**

1. **AuthContext Setup**
   - Create AuthContext dengan useState/useReducer
   - Login/logout functions
   - Persist token di localStorage
   - Protected routes wrapper

2. **Backend Integration**
   - API calls untuk semua actions
   - Real data dari database
   - Error handling

3. **Additional Features**
   - Loading states saat navigate
   - Breadcrumb navigation
   - Back button handling
   - 404 Page Not Found

4. **Admin Panel**
   - Admin routes
   - Protected admin-only pages
   - Admin dashboard

---

## 📝 **Notes**

- Semua navigate menggunakan React Router v6 `useNavigate()`
- Data passing menggunakan `location.state`
- Dummy authentication untuk demo
- Siap untuk integrasi backend
- Mobile responsive semua halaman

🎉 **Routing Integration Complete!**
