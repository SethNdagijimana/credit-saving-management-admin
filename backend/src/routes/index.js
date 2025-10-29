import express from "express"
import { body } from "express-validator"
import { validate } from "../middlewares/validationMiddleware.js"

import { adminLogin } from "../controllers/adminController.js"
import { listNotifications } from "../controllers/adminNotificationController.js"
import {
  deleteUser,
  getAllTransactions,
  getAllUsers,
  getUnverifiedUsers,
  unverifyUserDevice,
  verifyUserDevice
} from "../controllers/userController.js"
import { adminAuth } from "../middlewares/adminAuth.js"

const router = express.Router()

router.post(
  "/admin/login",
  [
    body("email").trim().isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required")
  ],
  validate,
  adminLogin
)

router.get("/users", adminAuth, getAllUsers)
router.get("/users/unverified", adminAuth, getUnverifiedUsers)
router.patch("/users/:userId/verify", adminAuth, verifyUserDevice)
router.patch("/users/:userId/unverify", adminAuth, unverifyUserDevice)
router.delete("/users/:userId", adminAuth, deleteUser)
router.get("/notifications", adminAuth, listNotifications)
router.get("/transactions", adminAuth, getAllTransactions)
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Credit Jambo Admin API" })
})

export default router
