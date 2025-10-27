import { adminUserDTO } from "../dtos/adminUserDTO.js"
import User from "../models/User.js"
import {
  getAllUsersService,
  getUnverifiedUsersService
} from "../services/adminUserService.js"

// ✅ Uses Service + DTO
export const getAllUsers = async (req, res) => {
  try {
    const results = await getAllUsersService()
    res.json({
      users: results.map(adminUserDTO)
    })
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ Uses Service + DTO
export const getUnverifiedUsers = async (req, res) => {
  try {
    const results = await getUnverifiedUsersService()
    res.json({
      users: results.map(adminUserDTO)
    })
  } catch (error) {
    console.error("Get unverified users error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ Leave exactly as it was (Admin permission only)
export const verifyUserDevice = async (req, res) => {
  const { userId } = req.params
  const user = await User.verifyDevice(userId)
  if (!user) return res.status(404).json({ message: "User not found" })
  res.json({ message: "User verified", user })
}

// ✅ Leave exactly as it was
export const unverifyUserDevice = async (req, res) => {
  const { userId } = req.params
  const user = await User.unverifyDevice(userId)
  if (!user) return res.status(404).json({ message: "User not found" })
  res.json({ message: "User unverified", user })
}

// ✅ Leave exactly as it was
export const deleteUser = async (req, res) => {
  const { userId } = req.params
  const user = await User.delete(userId)
  if (!user) return res.status(404).json({ message: "User not found" })
  res.json({ message: "User deleted", userId: user.id })
}
