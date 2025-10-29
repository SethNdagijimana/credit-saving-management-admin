import { adminUserDTO } from "../dtos/adminUserDTO.js"
import User from "../models/User.js"
import {
  getAllUsersService,
  getUnverifiedUsersService
} from "../services/adminUserService.js"
import { getAllTransactionsService } from "../services/userService.js"

export const getAllUsers = async (req, res) => {
  const results = await getAllUsersService()
  res.json({
    users: results.map(adminUserDTO)
  })
}

export const getUnverifiedUsers = async (req, res) => {
  const results = await getUnverifiedUsersService()
  res.json({
    users: results.map(adminUserDTO)
  })
}
export const verifyUserDevice = async (req, res) => {
  const { userId } = req.params
  const user = await User.verifyDevice(userId)
  if (!user) return res.status(404).json({ message: "User not found" })
  res.json({ message: "User verified", user })
}

export const unverifyUserDevice = async (req, res) => {
  const { userId } = req.params
  const user = await User.unverifyDevice(userId)
  if (!user) return res.status(404).json({ message: "User not found" })
  res.json({ message: "User unverified", user })
}

export const deleteUser = async (req, res) => {
  const { userId } = req.params
  const user = await User.delete(userId)
  if (!user) return res.status(404).json({ message: "User not found" })
  res.json({ message: "User deleted", userId: user.id })
}

export const getAllTransactions = async (req, res) => {
  const { userId } = req.query

  try {
    const transactions = await getAllTransactionsService(userId)

    res.status(200).json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    res.status(500).json({ message: "Server error" })
  }
}
