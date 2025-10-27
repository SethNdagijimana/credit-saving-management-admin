import jwt from "jsonwebtoken"
import pool from "../utils/db.js"
import { verifyPassword } from "../utils/hash.js"

export const loginAdminService = async (email, password) => {
  const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
    email
  ])
  const admin = result.rows[0]
  if (!admin) throw new Error("Invalid credentials")

  const isValid = verifyPassword(password, admin.salt, admin.password)
  if (!isValid) throw new Error("Invalid credentials")

  const token = jwt.sign(
    { id: admin.id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email
    }
  }
}
