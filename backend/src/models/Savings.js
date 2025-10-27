import pool from "../utils/db.js"

class Savings {
  static async getBalance(userId) {
    const result = await pool.query(
      "SELECT balance FROM savings WHERE user_id = $1",
      [userId]
    )
    return result.rows[0]?.balance || 0
  }
}

export default Savings
