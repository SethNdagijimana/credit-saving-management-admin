import express from "express"
import { adminLogin } from "../controllers/adminController.js"
import {
  deleteUser,
  getAllUsers,
  getUnverifiedUsers,
  unverifyUserDevice,
  verifyUserDevice
} from "../controllers/userController.js"

const router = express.Router()

// Admin auth
router.post("/admin/login", adminLogin)

// User management
router.get("/users", getAllUsers)
router.get("/users/unverified", getUnverifiedUsers)
router.patch("/users/:userId/verify", verifyUserDevice)
router.patch("/users/:userId/unverify", unverifyUserDevice)
router.delete("/users/:userId", deleteUser)

// Test route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Credit Jambo Admin API" })
})

export default router
