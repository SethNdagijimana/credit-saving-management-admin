import pool from "../utils/db.js"

class User {
  // Find user by email
  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email
    ])
    return result.rows[0]
  }

  // Find user by ID
  static async findById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    return result.rows[0]
  }

  // Get all users
  static async findAll() {
    const result = await pool.query(
      "SELECT id, name, email, device_id, verified, created_at FROM users ORDER BY created_at DESC"
    )
    return result.rows
  }

  // Get unverified users only
  static async findUnverified() {
    const result = await pool.query(
      "SELECT id, name, email, device_id, created_at FROM users WHERE verified = false ORDER BY created_at DESC"
    )
    return result.rows
  }

  // Verify user device
  static async verifyDevice(userId) {
    const result = await pool.query(
      "UPDATE users SET verified = true, updated_at = NOW() WHERE id = $1 RETURNING id, name, email, device_id, verified",
      [userId]
    )
    return result.rows[0]
  }

  // Unverify user device
  static async unverifyDevice(userId) {
    const result = await pool.query(
      "UPDATE users SET verified = false, updated_at = NOW() WHERE id = $1 RETURNING id, name, email, device_id, verified",
      [userId]
    )
    return result.rows[0]
  }

  // Delete user
  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    )
    return result.rows[0]
  }
}

export default User
