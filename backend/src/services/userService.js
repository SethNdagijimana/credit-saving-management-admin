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
