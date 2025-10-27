import pool from "../utils/db.js"

class Transaction {
  // Get last user transaction
  static async getLastTransaction(userId) {
    const result = await pool.query(
      `
      SELECT id, amount, type, created_at
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    )

    return result.rows[0] || null
  }
}

export default Transaction
