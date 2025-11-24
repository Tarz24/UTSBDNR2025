// Route handler untuk model 'user'
const express = require("express")
const router = express.Router()
const { body } = require("express-validator")

const { getUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/userController")

// GET all users (with optional email filter)
router.get("/users", getUsers)

// GET single user by ID
router.get("/users/:id", getUserById)

// POST create new user
router.post(
  "/users",
  body("nama").notEmpty().withMessage("Nama harus diisi"),
  body("email").isEmail().withMessage("Email tidak valid"),
  body("password").notEmpty().withMessage("Password harus diisi"),
  body("no_hp").notEmpty().withMessage("Nomor HP harus diisi"),
  createUser
)

// PATCH update user
router.patch("/users/:id", updateUser)

// DELETE user
router.delete("/users/:id", deleteUser)

module.exports = router
