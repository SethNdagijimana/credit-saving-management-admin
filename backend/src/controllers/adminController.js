import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "../utils/db.js"

// Admin login (you'll need to create admin users separately)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Query admin from admins table (you'll need to create this table)
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
      email
    ])

    const admin = result.rows[0]
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    })
  } catch (error) {
    console.error("Admin login error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
