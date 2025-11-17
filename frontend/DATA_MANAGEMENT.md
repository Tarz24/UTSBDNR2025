# 📊 Data Management dengan localStorage

## 🎯 Overview

Sistem ini menggunakan **localStorage** untuk mengelola data sementara sebelum integrasi dengan backend MongoDB. Data disimpan dalam format JSON dan dapat diakses melalui `AuthContext` dan `dataManager`.

---

## 📁 Struktur Data

### 1. **Users** (`localStorage.users`)

```json
[
  {
    "id": "USER001",
    "namaLengkap": "Ahmad Fadli",
    "email": "ahmad@email.com",
    "noHp": "081234567890",
    "password": "password123",
    "role": "user",
    "createdAt": "2024-01-10T08:00:00.000Z",
    "bookings": []
  }
]
```

**Fields:**
- `id` (string): Unique identifier (USER001, USER002, ...)
- `namaLengkap` (string): Full name
- `email` (string): Email address (unique)
- `noHp` (string): Phone number (unique)
- `password` (string): Password (plain text - will be hashed in production)
- `role` (string): "user" or "admin"
- `createdAt` (string): ISO timestamp
- `bookings` (array): Array of booking IDs

---

### 2. **Schedules** (`localStorage.schedules`)

```json
[
  {
    "id": "JDW001",
    "origin": "BANDUNG, PASTEUR2",
    "destination": "JAKARTA SELATAN, TEBET",
    "date": "2025-11-17",
    "time": "08:00",
    "price": 113000,
    "seats": 20,
    "availableSeats": 12,
    "status": "active",
    "createdAt": "2024-01-05T08:00:00.000Z"
  }
]
```
    "seats": 40,
    "availableSeats": 35,
    "status": "active",
    "createdAt": "2024-01-05T08:00:00.000Z"
  }
]
```

**Fields:**
- `id` (string): Unique identifier (JDW001, JDW002, ...)
- `origin` (string): Departure city
- `destination` (string): Arrival city
- `date` (string): Departure date (YYYY-MM-DD)
- `time` (string): Departure time (HH:MM)
- `price` (number): Price per seat
- `seats` (number): Total seats
- `availableSeats` (number): Available seats
- `status` (string): "active" or "inactive"
- `createdAt` (string): ISO timestamp

---

### 3. **Bookings** (`localStorage.bookings`)

```json
[
  {
    "id": "BK001",
    "userId": "USER001",
    "userName": "Ahmad Fadli",
    "userEmail": "ahmad@email.com",
    "userPhone": "081234567890",
    "scheduleId": "JDW001",
    "origin": "Jakarta",
    "destination": "Surabaya",
    "date": "2024-01-20",
    "time": "08:00",
    "seats": 2,
    "price": 250000,
    "totalPrice": 500000,
    "status": "confirmed",
    "bookingDate": "2024-01-15T10:30:00.000Z"
  }
]
```

**Fields:**
- `id` (string): Unique identifier (BK001, BK002, ...)
- `userId` (string): Reference to user
- `userName` (string): User's full name
- `userEmail` (string): User's email
- `userPhone` (string): User's phone
- `scheduleId` (string): Reference to schedule
- `origin` (string): Departure city
- `destination` (string): Arrival city
- `date` (string): Travel date
- `time` (string): Travel time
- `seats` (number): Number of seats booked
- `price` (number): Price per seat
- `totalPrice` (number): Total payment
- `status` (string): "pending", "confirmed", "completed", "cancelled"
- `bookingDate` (string): ISO timestamp when booking was made

---

### 4. **Current User** (`localStorage.currentUser`)

```json
{
  "id": "USER001",
  "namaLengkap": "Ahmad Fadli",
  "email": "ahmad@email.com",
  "noHp": "081234567890",
  "role": "user",
  "createdAt": "2024-01-10T08:00:00.000Z"
}
```

**Note:** Password tidak disimpan di currentUser untuk keamanan.

---

## 🔑 AuthContext API

### State
- `currentUser` - Current logged in user object
- `isLoggedIn` - Boolean authentication status
- `loading` - Loading state during initialization

### Methods

#### `register(userData)`
Register new user.

```javascript
const result = register({
  namaLengkap: "John Doe",
  email: "john@email.com",
  noHp: "081234567890",
  password: "password123"
});
// Returns: { success: true/false, message: string }
```

#### `login(email, password)`
Login user.

```javascript
const result = login("john@email.com", "password123");
// Returns: { success: true/false, message: string, user?: object }
```

#### `logout()`
Logout current user.

```javascript
logout();
```

#### `updateProfile(updates)`
Update user profile.

```javascript
const result = updateProfile({
  namaLengkap: "John Smith",
  noHp: "081234567899"
});
// Returns: { success: true/false, message: string }
```

#### `changePassword(oldPassword, newPassword)`
Change user password.

```javascript
const result = changePassword("oldpass123", "newpass123");
// Returns: { success: true/false, message: string }
```

#### `getUserBookings()`
Get all bookings for current user.

```javascript
const bookings = getUserBookings();
// Returns: array of booking objects
```

#### `addBooking(bookingData)`
Create new booking.

```javascript
const result = addBooking({
  scheduleId: "JDW001",
  origin: "Jakarta",
  destination: "Surabaya",
  date: "2024-01-20",
  time: "08:00",
  seats: 2,
  price: 250000,
  totalPrice: 500000
});
// Returns: { success: true/false, message: string, booking?: object }
```

---

## 📦 dataManager API

### Functions

#### `initializeDummyData()`
Initialize dummy data (only runs once).

```javascript
initializeDummyData();
```

#### `clearAllData()`
Clear all localStorage data.

```javascript
clearAllData();
```

#### `getAllUsers()`
Get all users.

```javascript
const users = getAllUsers();
```

#### `getAllSchedules()`
Get all schedules.

```javascript
const schedules = getAllSchedules();
```

#### `getAllBookings()`
Get all bookings.

```javascript
const bookings = getAllBookings();
```

#### `getActiveSchedules()`
Get active schedules (available for booking).

```javascript
const activeSchedules = getActiveSchedules();
```

#### `searchSchedules(origin, destination, date)`
Search schedules by criteria.

```javascript
const results = searchSchedules("Jakarta", "Surabaya", "2024-01-20");
```

#### `getScheduleById(scheduleId)`
Get schedule by ID.

```javascript
const schedule = getScheduleById("JDW001");
```

#### `addSchedule(scheduleData)`
Add new schedule (Admin only).

```javascript
const result = addSchedule({
  origin: "Jakarta",
  destination: "Bali",
  date: "2024-01-25",
  time: "08:00",
  price: 350000,
  seats: 40
});
```

#### `updateSchedule(scheduleId, updates)`
Update schedule (Admin only).

```javascript
const result = updateSchedule("JDW001", {
  price: 275000,
  availableSeats: 30
});
```

#### `deleteSchedule(scheduleId)`
Delete schedule (Admin only).

```javascript
const result = deleteSchedule("JDW001");
```

#### `updateBookingStatus(bookingId, newStatus)`
Update booking status (Admin only).

```javascript
const result = updateBookingStatus("BK001", "confirmed");
```

---

## 🔐 Dummy Accounts

### Users:
1. **Ahmad Fadli**
   - Email: `ahmad@email.com`
   - Password: `password123`
   - Role: User
   
2. **Siti Nurhaliza**
   - Email: `siti@email.com`
   - Password: `password123`
   - Role: User
   
3. **Budi Santoso**
   - Email: `budi@email.com`
   - Password: `password123`
   - Role: User

### Admin:
- **Admin Baraya**
  - Email: `admin@baraya.com`
  - Password: `admin123`
  - Role: Admin

---

## � Jadwal Tersedia

### Rute & Tanggal:

1. **BANDUNG → JAKARTA**
   - Tanggal: 17 November 2025
   - Jam 08:00 (12 kursi tersedia) - Rp 113.000
   - Jam 14:00 (8 kursi tersedia) - Rp 113.000

2. **JAKARTA → BANDUNG**
   - Tanggal: 18 November 2025
   - Jam 09:00 (15 kursi tersedia) - Rp 113.000
   - Jam 16:00 (5 kursi tersedia) - Rp 113.000

3. **JAKARTA PUSAT → PURWAKARTA**
   - Tanggal: 19 November 2025
   - Jam 10:00 (18 kursi tersedia) - Rp 85.000

4. **PURWAKARTA → JAKARTA SELATAN**
   - Tanggal: 20 November 2025
   - Jam 11:00 (10 kursi tersedia) - Rp 90.000

**Format lengkap lokasi:**
- `BANDUNG, PASTEUR2`
- `JAKARTA SELATAN, TEBET`
- `JAKARTA PUSAT, SARINAH`
- `JAKARTA SELATAN, KUNINGAN`
- `PURWAKARTA, KM72B`

> 💡 **Tip Testing**: Gunakan tanggal 17-20 November 2025 untuk melihat jadwal tersedia!

---

## �📝 Usage Examples

### 1. Login User

```javascript
import { useAuth } from './context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  
  const handleLogin = async () => {
    const result = login("ahmad@email.com", "password123");
    
    if (result.success) {
      console.log("Login successful!");
      navigate('/');
    } else {
      console.error(result.message);
    }
  };
}
```

### 2. Register New User

```javascript
import { useAuth } from './context/AuthContext';

function RegisterPage() {
  const { register } = useAuth();
  
  const handleRegister = async () => {
    const result = register({
      namaLengkap: "New User",
      email: "newuser@email.com",
      noHp: "081234567893",
      password: "password123"
    });
    
    if (result.success) {
      console.log("Registration successful!");
      navigate('/login');
    } else {
      console.error(result.message);
    }
  };
}
```

### 3. Create Booking

```javascript
import { useAuth } from './context/AuthContext';

function SearchPage() {
  const { addBooking, isLoggedIn } = useAuth();
  
  const handleBooking = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    const result = addBooking({
      scheduleId: "JDW001",
      origin: "Jakarta",
      destination: "Surabaya",
      date: "2024-01-20",
      time: "08:00",
      seats: 2,
      price: 250000,
      totalPrice: 500000
    });
    
    if (result.success) {
      navigate('/my-ticket', { state: { booking: result.booking } });
    }
  };
}
```

### 4. Get User Bookings

```javascript
import { useAuth } from './context/AuthContext';

function ProfilePage() {
  const { getUserBookings } = useAuth();
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    const userBookings = getUserBookings();
    setBookings(userBookings);
  }, []);
}
```

---

## 🚀 Next Steps

Setelah data management selesai, langkah selanjutnya:

1. ✅ Integrasi AuthContext ke LoginPage dan RegisterPage
2. ✅ Update Navbar untuk menggunakan isLoggedIn dari AuthContext
3. ✅ Integrasi data ke ProfileUserPage
4. ✅ Integrasi data ke SearchPage dan booking flow
5. ✅ Integrasi data ke AdminPanelPage
6. ⏭️ Buat Protected Routes untuk halaman yang memerlukan autentikasi
7. ⏭️ Backend integration dengan MongoDB

---

## ⚠️ Important Notes

1. **Security**: Password disimpan dalam plain text di localStorage. Di production, gunakan hashing (bcrypt) di backend.

2. **Persistence**: Data akan hilang jika localStorage di-clear. Untuk testing, gunakan `clearAllData()` di console.

3. **Validation**: Client-side validation sudah ada. Server-side validation akan ditambahkan saat backend integration.

4. **Auto-Initialize**: Dummy data akan otomatis di-load saat pertama kali aplikasi berjalan.

5. **Testing**: Gunakan browser DevTools > Application > Local Storage untuk melihat data.

---

## 🔄 Reset Data (Penting!)

Jika Anda sudah pernah membuka aplikasi sebelumnya dan ingin memuat data jadwal yang baru, ikuti langkah berikut:

### Cara 1: Via Browser Console (Recommended)
1. Buka Browser Console (F12 atau Klik Kanan > Inspect > Console)
2. Ketik: `BarayaDevTools.resetData()`
3. Refresh halaman (F5)
4. Data baru akan otomatis dimuat!

### Cara 2: Manual via DevTools
1. Buka DevTools (F12)
2. Pergi ke tab **Application**
3. Pilih **Local Storage** > `http://localhost:3000`
4. Klik kanan > **Clear**
5. Refresh halaman (F5)

### Cara 3: Via Console Manual
```javascript
localStorage.removeItem('dataInitialized');
localStorage.removeItem('users');
localStorage.removeItem('schedules');
localStorage.removeItem('bookings');
location.reload();
```

> ⚠️ **Update Data**: Setiap kali ada perubahan di `dataManager.js`, Anda **WAJIB** reset data menggunakan salah satu cara di atas!

---

## 🎉 Summary

✅ AuthContext dengan login/register/logout functionality  
✅ dataManager untuk CRUD operations  
✅ Dummy data: 4 users, 6 schedules (updated format), 5 bookings  
✅ localStorage persistence  
✅ Jadwal sesuai dengan lokasi di SearchForm  
✅ Data tanggal 17-20 November 2025  
✅ Ready untuk integrasi ke semua pages!  

**📍 Lokasi yang tersedia:**
- BANDUNG, PASTEUR2
- JAKARTA SELATAN, TEBET
- JAKARTA PUSAT, SARINAH
- JAKARTA SELATAN, KUNINGAN
- PURWAKARTA, KM72B
