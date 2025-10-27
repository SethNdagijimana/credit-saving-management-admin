import Transaction from "../models/Transaction.js"
import User from "../models/User.js"

export const getAllUsersService = async () => {
  const users = await User.findAll()

  const formattedUsers = await Promise.all(
    users.map(async (user) => {
      const lastTransaction = await Transaction.getLastTransaction(user.id)
      return {
        ...user,
        balance: user.balance,
        lastTransaction
      }
    })
  )

  return formattedUsers
}

export const getUnverifiedUsersService = async () => {
  const users = await User.findUnverified()

  const formattedUsers = await Promise.all(
    users.map(async (user) => {
      const lastTransaction = await Transaction.getLastTransaction(user.id)
      return {
        ...user,
        balance: user.balance,
        lastTransaction
      }
    })
  )

  return formattedUsers
}
