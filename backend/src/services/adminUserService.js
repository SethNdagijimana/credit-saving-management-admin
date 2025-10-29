import Transaction from "../models/Transaction.js"
import pool from "../utils/db.js"

export const getAllUsersService = async () => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.phone_number, u.verified, u.created_at,
            a.account_number, a.balance
     FROM users u
     LEFT JOIN accounts a ON a.user_id = u.id
     ORDER BY u.created_at DESC`
  )

  const users = result.rows

  return await Promise.all(
    users.map(async (user) => {
      const lastTransaction = await Transaction.getLastTransaction(user.id)
      return { ...user, lastTransaction }
    })
  )
}

export const getUnverifiedUsersService = async () => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.phone_number, u.verified, u.created_at,
            a.account_number, a.balance
     FROM users u
     LEFT JOIN accounts a ON a.user_id = u.id
     WHERE u.verified = false
     ORDER BY u.created_at DESC`
  )

  const users = result.rows

  return await Promise.all(
    users.map(async (user) => {
      const lastTransaction = await Transaction.getLastTransaction(user.id)
      return { ...user, lastTransaction }
    })
  )
}
