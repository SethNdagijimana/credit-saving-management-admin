import express from "express"
import { adminLogin } from "../controllers/adminController.js"
import {
  deleteUser,
  getAllUsers,
  getUnverifiedUsers,
  unverifyUserDevice,
  verifyUserDevice
} from "../controllers/userController.js"
import { adminAuth } from "../middlewares/adminAuth.js"

const router = express.Router()

router.post("/admin/login", adminLogin)

router.get("/users", adminAuth, getAllUsers)
router.get("/users/unverified", adminAuth, getUnverifiedUsers)
router.patch("/users/:userId/verify", adminAuth, verifyUserDevice)
router.patch("/users/:userId/unverify", adminAuth, unverifyUserDevice)
router.delete("/users/:userId", adminAuth, deleteUser)

// Test route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Credit Jambo Admin API" })
})

export default router
