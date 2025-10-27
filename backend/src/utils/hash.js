import crypto from "crypto"

export const hashPassword = (
  password,
  salt = crypto.randomBytes(16).toString("hex")
) => {
  const hashed = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex")
  return { hashed, salt }
}

export const verifyPassword = (password, salt, hashedPassword) => {
  const { hashed } = hashPassword(password, salt)
  return hashed === hashedPassword
}
