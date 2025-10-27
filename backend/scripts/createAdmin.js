import dotenv from "dotenv"
import pkg from "pg"
import { hashPassword } from "../src/utils/hash.js"

dotenv.config()
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DB_URL
})

const createAdmin = async () => {
  const name = "Admin User"
  const email = "admin@example.com"
  const password = "Admin123!"

  const { hashed, salt } = hashPassword(password)

  try {
    const result = await pool.query(
      "INSERT INTO admins (name, email, password, salt) VALUES ($1, $2, $3, $4) RETURNING id, name, email",
      [name, email, hashed, salt]
    )

    console.log("✅ Admin created:", result.rows[0])
    process.exit(0)
  } catch (error) {
    console.error("❌ Error creating admin:", error.message)
    process.exit(1)
  }
}

createAdmin()
