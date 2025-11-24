// Initialize dummy data in localStorage
export const initializeDummyData = () => {
  // Check if data already exists
  if (localStorage.getItem("dataInitialized") === "true") {
    return
  }

  // Dummy Users
  const dummyUsers = [
    {
      id: "USER001",
      namaLengkap: "Ahmad Fadli",
      email: "ahmad@email.com",
      noHp: "081234567890",
      password: "password123",
      role: "user",
      createdAt: "2024-01-10T08:00:00.000Z",
      bookings: [],
    },
    {
      id: "USER002",
      namaLengkap: "Siti Nurhaliza",
      email: "siti@email.com",
      noHp: "081234567891",
      password: "password123",
      role: "user",
      createdAt: "2024-01-11T09:00:00.000Z",
      bookings: [],
    },
    {
      id: "USER003",
      namaLengkap: "Budi Santoso",
      email: "budi@email.com",
      noHp: "081234567892",
      password: "password123",
      role: "user",
      createdAt: "2024-01-12T10:00:00.000Z",
      bookings: [],
    },
    {
      id: "ADMIN001",
      namaLengkap: "Admin Baraya",
      email: "admin@baraya.com",
      noHp: "081234567899",
      password: "admin123",
      role: "admin",
      createdAt: "2024-01-01T00:00:00.000Z",
      bookings: [],
    },
  ]

  // Dummy Schedules
  const dummySchedules = [
    {
      id: "JDW001",
      origin: "BANDUNG, PASTEUR2",
      destination: "JAKARTA SELATAN, TEBET",
      date: "2025-11-17",
      time: "08:00",
      price: 113000,
      seats: 20,
      availableSeats: 12,
      status: "active",
      createdAt: "2024-01-05T08:00:00.000Z",
    },
    {
      id: "JDW002",
      origin: "BANDUNG, PASTEUR2",
      destination: "JAKARTA SELATAN, TEBET",
      date: "2025-11-17",
      time: "14:00",
      price: 113000,
      seats: 20,
      availableSeats: 8,
      status: "active",
      createdAt: "2024-01-05T09:00:00.000Z",
    },
    {
      id: "JDW003",
      origin: "JAKARTA SELATAN, TEBET",
      destination: "BANDUNG, PASTEUR2",
      date: "2025-11-18",
      time: "09:00",
      price: 113000,
      seats: 20,
      availableSeats: 15,
      status: "active",
      createdAt: "2024-01-05T10:00:00.000Z",
    },
    {
      id: "JDW004",
      origin: "JAKARTA SELATAN, TEBET",
      destination: "BANDUNG, PASTEUR2",
      date: "2025-11-18",
      time: "16:00",
      price: 113000,
      seats: 20,
      availableSeats: 5,
      status: "active",
      createdAt: "2024-01-05T07:00:00.000Z",
    },
    {
      id: "JDW005",
      origin: "JAKARTA PUSAT, SARINAH",
      destination: "PURWAKARTA, KM72B",
      date: "2025-11-19",
      time: "10:00",
      price: 85000,
      seats: 20,
      availableSeats: 18,
      status: "active",
      createdAt: "2024-01-05T06:00:00.000Z",
    },
    {
      id: "JDW006",
      origin: "PURWAKARTA, KM72B",
      destination: "JAKARTA SELATAN, KUNINGAN",
      date: "2025-11-20",
      time: "11:00",
      price: 90000,
      seats: 20,
      availableSeats: 10,
      status: "active",
      createdAt: "2024-01-05T11:00:00.000Z",
    },
  ]

  // Dummy Bookings
  const dummyBookings = [
    {
      id: "BK001",
      userId: "USER001",
      userName: "Ahmad Fadli",
      userEmail: "ahmad@email.com",
      userPhone: "081234567890",
      scheduleId: "JDW001",
      origin: "BANDUNG, PASTEUR2",
      destination: "JAKARTA SELATAN, TEBET",
      date: "2025-11-17",
      time: "08:00",
      seats: 2,
      price: 113000,
      totalPrice: 226000,
      status: "confirmed",
      bookingDate: "2024-01-15T10:30:00.000Z",
    },
    {
      id: "BK002",
      userId: "USER002",
      userName: "Siti Nurhaliza",
      userEmail: "siti@email.com",
      userPhone: "081234567891",
      scheduleId: "JDW003",
      origin: "JAKARTA SELATAN, TEBET",
      destination: "BANDUNG, PASTEUR2",
      date: "2025-11-18",
      time: "09:00",
      seats: 1,
      price: 113000,
      totalPrice: 113000,
      status: "pending",
      bookingDate: "2024-01-16T11:20:00.000Z",
    },
    {
      id: "BK003",
      userId: "USER003",
      userName: "Budi Santoso",
      userEmail: "budi@email.com",
      userPhone: "081234567892",
      scheduleId: "JDW002",
      origin: "BANDUNG, PASTEUR2",
      destination: "JAKARTA SELATAN, TEBET",
      date: "2025-11-17",
      time: "14:00",
      seats: 3,
      price: 113000,
      totalPrice: 339000,
      status: "completed",
      bookingDate: "2024-01-14T14:15:00.000Z",
    },
    {
      id: "BK004",
      userId: "USER001",
      userName: "Ahmad Fadli",
      userEmail: "ahmad@email.com",
      userPhone: "081234567890",
      scheduleId: "JDW004",
      origin: "JAKARTA SELATAN, TEBET",
      destination: "BANDUNG, PASTEUR2",
      date: "2025-11-18",
      time: "16:00",
      seats: 1,
      price: 113000,
      totalPrice: 113000,
      status: "cancelled",
      bookingDate: "2024-01-15T09:00:00.000Z",
    },
    {
      id: "BK005",
      userId: "USER001",
      userName: "Ahmad Fadli",
      userEmail: "ahmad@email.com",
      userPhone: "081234567890",
      scheduleId: "JDW005",
      origin: "JAKARTA PUSAT, SARINAH",
      destination: "PURWAKARTA, KM72B",
      date: "2025-11-19",
      time: "10:00",
      seats: 2,
      price: 85000,
      totalPrice: 170000,
      status: "confirmed",
      bookingDate: "2024-11-16T08:30:00.000Z",
    },
  ]

  // Save to localStorage
  localStorage.setItem("users", JSON.stringify(dummyUsers))
  localStorage.setItem("schedules", JSON.stringify(dummySchedules))
  localStorage.setItem("bookings", JSON.stringify(dummyBookings))
  localStorage.setItem("dataInitialized", "true")

  console.log("✅ Dummy data initialized successfully!")
  console.log("👤 Users:", dummyUsers.length)
  console.log("📅 Schedules:", dummySchedules.length)
  console.log("🎫 Bookings:", dummyBookings.length)
}

// Clear all data (for testing)
export const clearAllData = () => {
  localStorage.removeItem("users")
  localStorage.removeItem("schedules")
  localStorage.removeItem("bookings")
  localStorage.removeItem("currentUser")
  localStorage.removeItem("dataInitialized")
  console.log("🗑️ All data cleared!")
}

// Get all users
export const getAllUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("users") || "[]")
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
}

// Get all schedules
export const getAllSchedules = () => {
  try {
    return JSON.parse(localStorage.getItem("schedules") || "[]")
  } catch (error) {
    console.error("Error getting schedules:", error)
    return []
  }
}

// Fetch all schedules from backend API (async)
export const fetchAllSchedules = async () => {
  try {
    const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"
    const res = await fetch(`${base}/jadwal`)
    if (!res.ok) {
      console.error("Failed to fetch schedules from API:", res.status, res.statusText)
      return []
    }
    const data = await res.json()
    // Map data from backend schema to frontend shape expected by Admin pages
    if (!Array.isArray(data)) return []
    return data.map(item => {
      const jam = item.jam_berangkat ? new Date(item.jam_berangkat) : null
      const date = jam ? jam.toISOString().split("T")[0] : item.date || null
      const time = jam ? jam.toTimeString().slice(0, 5) : item.time || null

      return {
        _id: item._id || (item._doc && item._doc._id) || null,
        id: item.id || (item._id ? String(item._id) : null),
        origin: item.rute_awal || item.origin || "",
        destination: item.rute_tujuan || item.destination || "",
        date,
        time,
        price: item.harga || item.price || 0,
        seats: item.total_kursi || item.seats || 0,
        availableSeats: item.kursi_tersedia || item.availableSeats || 0,
        status: item.status || "active",
        createdAt: item.createdAt || item.created_at || null,
      }
    })
  } catch (error) {
    console.error("Error fetching schedules from API:", error)
    return []
  }
}

// Get all bookings (try API first, fallback to localStorage)
export const getAllBookings = async () => {
  const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"

  try {
    const res = await fetch(`${base}/pemesanan`)
    if (res.ok) {
      const data = await res.json()
      console.log("📦 [getAllBookings] Raw data from API:", data)

      if (Array.isArray(data)) {
        const mapped = data.map(item => {
          // map backend pemesanan shape to frontend booking shape
          const user = item.user || {}
          const jadwal = item.jadwal || {}
          const tanggal = item.date || item.bookingDate || item.createdAt || null
          const dateStr = tanggal ? new Date(tanggal).toISOString().split("T")[0] : item.date || ""
          const timeStr = jadwal.jam_berangkat ? new Date(jadwal.jam_berangkat).toTimeString().slice(0, 5) : item.time || ""

          const mappedItem = {
            // PENTING: Simpan _id asli dari MongoDB untuk update operations
            _id: item._id,
            // Display ID menggunakan kode_booking jika ada, fallback ke _id
            id: item.kode_booking || item.id || item._id,
            userId: user._id || item.userId || null,
            userName: user.namaLengkap || user.nama || item.userName || user.name || "",
            email: user.email || item.userEmail || "",
            phone: user.noHp || item.userPhone || "",
            scheduleId: jadwal._id || item.jadwal || item.scheduleId || item.schedule_id,
            origin: jadwal.rute_awal || item.origin || "",
            destination: jadwal.rute_tujuan || item.destination || "",
            date: dateStr,
            time: timeStr,
            seats: item.jumlah_penumpang || item.seats || 0,
            price: item.total_harga || item.price || 0,
            totalPrice: item.total_harga || item.totalPrice || 0,
            status: item.status || item.status_pembayaran || "pending",
            bookingDate: item.bookingDate,
          }

          console.log("📦 [getAllBookings] Mapped item:", mappedItem)
          return mappedItem
        })

        return mapped
      }
    } else {
      console.warn("getAllBookings API returned", res.status)
    }
  } catch (error) {
    console.warn("Error fetching bookings from API:", error)
  }

  // fallback to localStorage
  try {
    return JSON.parse(localStorage.getItem("bookings") || "[]")
  } catch (error) {
    console.error("Error getting bookings (fallback):", error)
    return []
  }
}

// Get active schedules (available for booking)
export const getActiveSchedules = () => {
  const schedules = getAllSchedules()
  const today = new Date().toISOString().split("T")[0]

  return schedules.filter(schedule => schedule.status === "active" && schedule.date >= today && schedule.availableSeats > 0)
}

// Search schedules
export const searchSchedules = (origin, destination, date) => {
  const schedules = getActiveSchedules()

  return schedules.filter(schedule => {
    const matchOrigin = !origin || schedule.origin.toLowerCase().includes(origin.toLowerCase())
    const matchDestination = !destination || schedule.destination.toLowerCase().includes(destination.toLowerCase())
    const matchDate = !date || schedule.date === date

    return matchOrigin && matchDestination && matchDate
  })
}

// Get schedule by ID
export const getScheduleById = scheduleId => {
  const schedules = getAllSchedules()
  return schedules.find(schedule => schedule.id === scheduleId)
}

// Create or get user in MongoDB by email
// This ensures user exists in MongoDB before creating a booking
export const ensureUserInMongoDB = async (userLocalData) => {
  const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"
  
  console.log("[ensureUserInMongoDB] User data from localStorage:", userLocalData)
  
  try {
    // Check if user already has _id (already in MongoDB)
    if (userLocalData._id) {
      console.log("[ensureUserInMongoDB] User already has _id:", userLocalData._id)
      return { success: true, userId: userLocalData._id }
    }
    
    // Try to find user by email in MongoDB
    console.log("[ensureUserInMongoDB] Searching for user by email:", userLocalData.email)
    
    const searchRes = await fetch(`${base}/users?email=${encodeURIComponent(userLocalData.email)}`)
    console.log("[ensureUserInMongoDB] Search response status:", searchRes.status)
    
    if (!searchRes.ok) {
      const errorText = await searchRes.text()
      console.error("[ensureUserInMongoDB] Search failed:", searchRes.status, errorText)
      return { success: false, message: `API error: ${searchRes.status}` }
    }
    
    const responseText = await searchRes.text()
    console.log("[ensureUserInMongoDB] Raw response:", responseText)
    
    let users
    try {
      users = JSON.parse(responseText)
    } catch (parseError) {
      console.error("[ensureUserInMongoDB] Failed to parse JSON:", parseError)
      console.error("[ensureUserInMongoDB] Response text:", responseText)
      return { success: false, message: `Failed to parse response: ${parseError.message}` }
    }
    
    if (users && Array.isArray(users) && users.length > 0) {
      console.log("[ensureUserInMongoDB] ✅ User found in MongoDB:", users[0])
      return { success: true, userId: users[0]._id }
    }
    
    console.log("[ensureUserInMongoDB] User not found, creating new user...")
    
    // User not found, create new user in MongoDB
    const payload = {
      nama: userLocalData.namaLengkap || userLocalData.nama,
      email: userLocalData.email,
      password: userLocalData.password || "defaultPassword123", // Default password
      no_hp: userLocalData.noHp || userLocalData.no_hp,
      role: userLocalData.role || "user"
    }
    
    console.log("[ensureUserInMongoDB] Creating new user with payload:", payload)
    
    const createRes = await fetch(`${base}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    
    console.log("[ensureUserInMongoDB] Create response status:", createRes.status)
    
    if (!createRes.ok) {
      const errorText = await createRes.text()
      console.error("[ensureUserInMongoDB] Create failed:", createRes.status, errorText)
      return { success: false, message: `Failed to create user: ${createRes.status}` }
    }
    
    const createText = await createRes.text()
    console.log("[ensureUserInMongoDB] Create raw response:", createText)
    
    let createBody
    try {
      createBody = JSON.parse(createText)
    } catch (parseError) {
      console.error("[ensureUserInMongoDB] Failed to parse create response:", parseError)
      return { success: false, message: `Failed to parse create response: ${parseError.message}` }
    }
    
    if (createBody._id) {
      console.log("[ensureUserInMongoDB] ✅ User created successfully:", createBody._id)
      return { success: true, userId: createBody._id }
    } else {
      console.error("[ensureUserInMongoDB] ❌ Failed to create user:", createBody)
      return { success: false, message: createBody.message || "Failed to create user in MongoDB" }
    }
  } catch (error) {
    console.error("[ensureUserInMongoDB] ❌ Exception:", error)
    return { success: false, message: `Error: ${error.message}` }
  }
}

// Update schedule
export const updateSchedule = async (scheduleId, updates) => {
  // If scheduleId is not a MongoDB ObjectId, skip calling API and update localStorage
  const isObjectId = typeof scheduleId === "string" && /^[a-fA-F0-9]{24}$/.test(scheduleId)
  if (!isObjectId) {
    try {
      const schedules = getAllSchedules()
      const index = schedules.findIndex(s => s.id === scheduleId || s._id === scheduleId)

      if (index === -1) {
        return { success: false, message: "Jadwal tidak ditemukan!" }
      }

      schedules[index] = {
        ...schedules[index],
        ...updates,
        // preserve or update the custom frontend ID (JDWxxx) if provided
        id: updates.id !== undefined ? updates.id : schedules[index].id,
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem("schedules", JSON.stringify(schedules))
      return { success: true, message: "Jadwal berhasil diupdate! (local fallback)" }
    } catch (error) {
      console.error("Error updating schedule (local fallback):", error)
      return { success: false, message: "Terjadi kesalahan saat update jadwal" }
    }
  }

  // Try API patch first
  try {
    const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"
    // Map frontend update fields to backend schema
    const payload = {}
    // allow updating the custom frontend ID (JDWxxx)
    if (updates.id !== undefined) payload.id = updates.id
    if (updates.origin !== undefined) payload.rute_awal = updates.origin
    if (updates.destination !== undefined) payload.rute_tujuan = updates.destination
    if (updates.price !== undefined) payload.harga = updates.price
    if (updates.seats !== undefined) {
      payload.total_kursi = updates.seats
      if (updates.availableSeats !== undefined) payload.kursi_tersedia = updates.availableSeats
    }
    if (updates.date !== undefined || updates.time !== undefined) {
      const currentDate = updates.date || null
      const currentTime = updates.time || "00:00"
      if (currentDate) {
        const jamBerangkat = new Date(`${currentDate}T${currentTime}`)
        payload.jam_berangkat = jamBerangkat.toISOString()
        payload.estimasi_jam_tiba = new Date(jamBerangkat.getTime() + 3 * 60 * 60 * 1000).toISOString()
      }
    }

    const res = await fetch(`${base}/jadwal/${scheduleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const body = await (async () => {
      try {
        return await res.json()
      } catch (e) {
        return null
      }
    })()

    if (!res.ok) {
      const errMsg = body && body.message ? body.message : `API update failed: ${res.status}`
      return { success: false, message: `API error: ${errMsg}`, details: body }
    }

    return { success: true, message: "Jadwal berhasil diupdate!", schedule: body }
  } catch (apiError) {
    console.warn("API updateSchedule failed:", apiError)
    return { success: false, message: `API error: ${apiError.message}` }
  }
}

// Delete schedule
export const deleteSchedule = async scheduleId => {
  // If id is not a MongoDB ObjectId, delete from local storage directly
  const isObjectId = typeof scheduleId === "string" && /^[a-fA-F0-9]{24}$/.test(scheduleId)
  if (!isObjectId) {
    try {
      const schedules = getAllSchedules()
      const filteredSchedules = schedules.filter(s => s.id !== scheduleId && s._id !== scheduleId)
      localStorage.setItem("schedules", JSON.stringify(filteredSchedules))
      return { success: true, message: "Jadwal berhasil dihapus! (local fallback)" }
    } catch (error) {
      console.error("Error deleting schedule (local):", error)
      return { success: false, message: "Terjadi kesalahan saat hapus jadwal" }
    }
  }

  // Try delete on backend
  try {
    const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"
    const res = await fetch(`${base}/jadwal/${scheduleId}`, { method: "DELETE" })
    if (!res.ok && res.status !== 204) {
      const body = await (async () => {
        try {
          return await res.json()
        } catch (e) {
          return null
        }
      })()
      const errMsg = body && body.message ? body.message : `API delete failed: ${res.status}`
      return { success: false, message: `API error: ${errMsg}`, details: body }
    }

    return { success: true, message: "Jadwal berhasil dihapus!" }
  } catch (apiError) {
    console.warn("API deleteSchedule failed:", apiError)
    return { success: false, message: `API error: ${apiError.message}` }
  }
}

// Add schedule
export const addSchedule = async scheduleData => {
  // Basic validation before calling API
  if (!scheduleData.date || !scheduleData.time) {
    return { success: false, message: "Tanggal dan waktu harus diisi!" }
  }
  if (!Number.isFinite(Number(scheduleData.price))) {
    return { success: false, message: "Harga tidak valid!" }
  }
  if (!Number.isFinite(Number(scheduleData.seats))) {
    return { success: false, message: "Jumlah kursi tidak valid!" }
  }

  // Try to create schedule via backend API, fallback to localStorage
  try {
    const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"
    // Build backend payload
    const jamBerangkat = new Date(`${scheduleData.date}T${scheduleData.time}`)
    if (isNaN(jamBerangkat.getTime())) {
      return { success: false, message: "Format tanggal/waktu tidak valid!" }
    }
    const estimasi = new Date(jamBerangkat.getTime() + 3 * 60 * 60 * 1000) // +3 hours as estimate

    const payload = {
      // include custom frontend ID if provided (JDWxxx)
      ...(scheduleData.id ? { id: scheduleData.id } : {}),
      rute_awal: scheduleData.origin,
      rute_tujuan: scheduleData.destination,
      pool_keberangkatan: scheduleData.origin,
      pool_tujuan: scheduleData.destination,
      jam_berangkat: jamBerangkat.toISOString(),
      estimasi_jam_tiba: estimasi.toISOString(),
      harga: scheduleData.price,
      total_kursi: scheduleData.seats,
      kursi_tersedia: scheduleData.seats,
    }

    const res = await fetch(`${base}/jadwal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const saved = await (async () => {
      try {
        return await res.json()
      } catch (e) {
        return null
      }
    })()

    if (!res.ok) {
      const errMsg = saved && saved.message ? saved.message : `API create failed: ${res.status}`
      return { success: false, message: `API error: ${errMsg}`, details: saved }
    }
    const schedule = {
      _id: saved._id || (saved._doc && saved._doc._id) || null,
      id: saved.id || (saved._id ? String(saved._id) : null),
      origin: saved.rute_awal || saved.origin || scheduleData.origin,
      destination: saved.rute_tujuan || saved.destination || scheduleData.destination,
      date: scheduleData.date,
      time: scheduleData.time,
      price: saved.harga || saved.price || scheduleData.price,
      seats: saved.total_kursi || saved.seats || scheduleData.seats,
      availableSeats: saved.kursi_tersedia || saved.availableSeats || scheduleData.seats,
      status: saved.status || "active",
      createdAt: saved.createdAt || new Date().toISOString(),
    }

    return { success: true, message: "Jadwal berhasil ditambahkan!", schedule }
  } catch (apiError) {
    console.warn("API addSchedule failed, falling back to localStorage:", apiError)
    try {
      const schedules = getAllSchedules()

      const newSchedule = {
        id: scheduleData.id || `JDW${String(schedules.length + 1).padStart(3, "0")}`,
        ...scheduleData,
        availableSeats: scheduleData.seats,
        status: "active",
        createdAt: new Date().toISOString(),
      }

      schedules.push(newSchedule)
      localStorage.setItem("schedules", JSON.stringify(schedules))

      return { success: true, message: "Jadwal berhasil ditambahkan! (local fallback)", schedule: newSchedule }
    } catch (error) {
      console.error("Error adding schedule (fallback):", error)
      return { success: false, message: "Terjadi kesalahan saat tambah jadwal" }
    }
  }
}

// Add new booking to MongoDB
export const addBooking = async (bookingData) => {
  const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"
  
  console.log("[addBooking] Starting with data:", bookingData)
  
  try {
    // Validate required fields
    if (!bookingData.user || !bookingData.jadwal) {
      return { success: false, message: "User dan Jadwal harus diisi!" }
    }
    
    if (!bookingData.seats || bookingData.seats < 1) {
      return { success: false, message: "Jumlah penumpang harus minimal 1!" }
    }
    
    if (!bookingData.nomor_kursi || bookingData.nomor_kursi.length === 0) {
      return { success: false, message: "Nomor kursi harus diisi!" }
    }
    
    // Build backend payload with new field names
    const payload = {
      id: bookingData.id || undefined, // Optional custom ID
      user: bookingData.user, // MongoDB ObjectId
      jadwal: bookingData.jadwal, // MongoDB ObjectId
      seats: bookingData.seats,
      nomor_kursi: bookingData.nomor_kursi, // Array of strings
      totalPrice: bookingData.totalPrice
    }
    
    console.log("[addBooking] Payload:", payload)
    
    const res = await fetch(`${base}/pemesanan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    console.log("[addBooking] API Response status:", res.status)
    
    const respBody = await (async () => {
      try {
        return await res.json()
      } catch (e) {
        console.warn("[addBooking] Failed to parse response body:", e)
        return null
      }
    })()
    
    console.log("[addBooking] API Response body:", respBody)
    
    if (res.ok) {
      console.log("[addBooking] ✅ Success")
      return { success: true, message: "Pemesanan berhasil ditambahkan!", booking: respBody }
    } else {
      console.error("[addBooking] ❌ API Failed:", res.status, respBody)
      
      // Handle validation errors from backend
      if (respBody && respBody.errors && Array.isArray(respBody.errors)) {
        const errorMessages = respBody.errors.map(err => err.msg || err.message).join(", ")
        return { success: false, message: `Validation error: ${errorMessages}`, details: respBody }
      }
      
      return { success: false, message: respBody?.message || `API error: ${res.status}`, details: respBody }
    }
  } catch (error) {
    console.error("[addBooking] ❌ Exception:", error)
    return { success: false, message: `Error: ${error.message}` }
  }
}

// Update booking status
export const updateBookingStatus = async (bookingId, newStatus) => {
  const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api"

  console.log("[updateBookingStatus] Starting update:", { bookingId, newStatus })

  // Use backend convenience endpoints when possible
  try {
    let url
    if (newStatus === "confirmed") url = `${base}/pemesanan/${bookingId}/confirm`
    else if (newStatus === "cancelled") url = `${base}/pemesanan/${bookingId}/cancel`
    else if (newStatus === "completed") url = `${base}/pemesanan/${bookingId}/complete`
    else url = `${base}/pemesanan/${bookingId}/status`

    console.log("[updateBookingStatus] Calling API:", url)

    const body = url.endsWith("/status") ? JSON.stringify({ status: newStatus }) : undefined

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body,
    })

    console.log("[updateBookingStatus] API Response status:", res.status)

    const respBody = await (async () => {
      try {
        return await res.json()
      } catch (e) {
        console.warn("[updateBookingStatus] Failed to parse response body:", e)
        return null
      }
    })()

    console.log("[updateBookingStatus] API Response body:", respBody)

    if (res.ok) {
      console.log("[updateBookingStatus] ✅ API Success")
      return { success: true, message: "Status booking berhasil diupdate (API)", booking: respBody }
    } else {
      console.error("[updateBookingStatus] ❌ API Failed:", res.status, respBody)
      return { success: false, message: `API error: ${res.status} - ${respBody?.message || "Unknown error"}`, booking: null }
    }
  } catch (apiError) {
    console.error("[updateBookingStatus] ❌ API Exception:", apiError)
    return { success: false, message: `API exception: ${apiError.message}`, booking: null }
  }
}

const dataManager = {
  initializeDummyData,
  clearAllData,
  getAllUsers,
  getAllSchedules,
  fetchAllSchedules,
  getAllBookings,
  getActiveSchedules,
  searchSchedules,
  getScheduleById,
  ensureUserInMongoDB,
  updateSchedule,
  deleteSchedule,
  addSchedule,
  addBooking,
  updateBookingStatus,
}

export default dataManager
