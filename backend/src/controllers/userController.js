import User from "../models/User.js"

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll()
    res.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get unverified users
export const getUnverifiedUsers = async (req, res) => {
  try {
    const users = await User.findUnverified()
    res.json({ users })
  } catch (error) {
    console.error("Error fetching unverified users:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Verify user device
export const verifyUserDevice = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.verifyDevice(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "User device verified successfully",
      user
    })
  } catch (error) {
    console.error("Error verifying user:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Unverify user device
export const unverifyUserDevice = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.unverifyDevice(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "User device unverified successfully",
      user
    })
  } catch (error) {
    console.error("Error unverifying user:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.delete(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "User deleted successfully",
      userId: user.id
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ message: "Server error" })
  }
}
