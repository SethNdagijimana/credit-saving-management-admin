export const adminUserDTO = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone_number: u.phone_number,
  verified: u.verified,
  accountNumber: u.account_number || null,
  balance: Number(u.balance) || 0,
  lastTransaction: u.lastTransaction || null,
  createdAt: u.created_at ? new Date(u.created_at).toISOString() : null
})
