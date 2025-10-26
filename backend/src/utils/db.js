import dotenv from "dotenv"
import pkg from "pg"
dotenv.config()

const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DB_URL
})

export default pool
