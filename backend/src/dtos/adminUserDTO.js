export const adminUserDTO = (data) => ({
  id: data.id,
  name: data.name,
  email: data.email,
  deviceId: data.deviceId,
  verified: data.verified,
  balance: data.balance || 0,
  lastTransaction: data.lastTransaction || null,
  createdAt: data.createdAt
})
