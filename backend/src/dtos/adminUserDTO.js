export const adminUserDTO = (data) => ({
  id: data.id,
  name: data.name,
  email: data.email,
  deviceId: data.device_id,
  verified: data.verified,
  balance: data.balance || 0,
  phone_number: data.phone_number || null,
  lastTransaction: data.lastTransaction || null,
  createdAt: data.createdAt
})
