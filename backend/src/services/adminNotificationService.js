import pool from "../utils/db.js"

export const getAllNotifications = async () => {
  const result = await pool.query(
    `SELECT n.*, u.name AS user_name, u.email
     FROM notifications n
     LEFT JOIN users u ON u.id = n.user_id
     ORDER BY created_at DESC`
  )
  return result.rows
}
