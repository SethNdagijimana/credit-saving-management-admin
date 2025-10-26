import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import pkg from "pg"

dotenv.config()
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DB_URL
})

const createAdmin = async () => {
  const name = "Admin User"
  const email = "admin@example.com"
  const password = "Admin123!"

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const result = await pool.query(
      "INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    )

    console.log("✅ Admin created successfully:", result.rows[0])
    process.exit(0)
  } catch (error) {
    console.error("❌ Error creating admin:", error.message)
    process.exit(1)
  }
}

createAdmin()
