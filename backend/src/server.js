import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import router from "./routes/index.js"

dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

// Use routes
app.use("/api", router)

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`✅ Admin Server running on port ${PORT}`))
