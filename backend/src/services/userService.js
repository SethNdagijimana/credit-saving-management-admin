import { adminUserDTO } from "../dtos/adminUserDTO.js"
import {
  getAllUsersService,
  getUnverifiedUsersService
} from "../services/adminUserService.js"

export const getAllUsers = async (req, res) => {
  const results = await getAllUsersService()
  res.json({
    users: results.map((r) =>
      adminUserDTO(r.user, r.balance, r.lastTransaction)
    )
  })
}

export const getUnverifiedUsers = async (req, res) => {
  const results = await getUnverifiedUsersService()
  res.json({
    users: results.map((r) =>
      adminUserDTO(r.user, r.balance, r.lastTransaction)
    )
  })
}

export const getAllTransactionsService = async () => {
  const result = await pool.query(
    `SELECT
        t.*,
        u.name AS user_name,
        a.account_number
     FROM transactions t
     LEFT JOIN users u ON u.id = t.user_id
     LEFT JOIN accounts a ON a.user_id = t.user_id
     ORDER BY t.created_at DESC`
  )

  return result.rows
}
