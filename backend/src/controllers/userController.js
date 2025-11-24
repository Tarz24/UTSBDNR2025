// Controller untuk User
const { validationResult } = require("express-validator")
const UserModel = require("../models/User")
const mongoose = require("mongoose")

// GET /users - Get all users or search by email
const getUsers = async (req, res) => {
  try {
    const { email } = req.query
    
    const filter = {}
    if (email) {
      filter.email = email.toLowerCase()
    }
    
    const users = await UserModel.find(filter)
    res.status(200).json(users)
  } catch (error) {
    console.error("Error getting users:", error)
    res.status(500).json({ message: "Internal server error", details: error.message })
  }
}

// GET /users/:id - Get user by ID
const getUserById = async (req, res) => {
  try {
    const id = req.params.id
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" })
    }
    
    const user = await UserModel.findById(id)
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" })
    }
    
    res.status(200).json(user)
  } catch (error) {
    console.error("Error getting user by id:", error)
    res.status(500).json({ message: "Internal server error", details: error.message })
  }
}

// POST /users - Create new user
const createUser = async (req, res) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() })
  }
  
  try {
    const { nama, email, password, no_hp, role } = req.body
    
    // Check if user with email already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" })
    }
    
    // Create new user (password should be hashed in production)
    const newUser = new UserModel({
      nama,
      email: email.toLowerCase(),
      password, // In production, hash this with bcrypt
      no_hp,
      role: role || "user"
    })
    
    const saved = await newUser.save()
    console.log("✅ User created:", saved._id)
    
    res.status(201).json(saved)
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ message: "Internal server error", details: error.message })
  }
}

// PATCH /users/:id - Update user
const updateUser = async (req, res) => {
  const id = req.params.id
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" })
  }
  
  try {
    const updates = { ...req.body }
    
    // Don't allow direct password update without hashing
    if (updates.password) {
      delete updates.password
    }
    
    const updated = await UserModel.findByIdAndUpdate(id, updates, { 
      new: true, 
      runValidators: true 
    })
    
    if (!updated) {
      return res.status(404).json({ message: "User tidak ditemukan" })
    }
    
    res.status(200).json(updated)
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ message: "Internal server error", details: error.message })
  }
}

// DELETE /users/:id - Delete user
const deleteUser = async (req, res) => {
  const id = req.params.id
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" })
  }
  
  try {
    const deleted = await UserModel.findByIdAndDelete(id)
    
    if (!deleted) {
      return res.status(404).json({ message: "User tidak ditemukan" })
    }
    
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ message: "Internal server error", details: error.message })
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}
