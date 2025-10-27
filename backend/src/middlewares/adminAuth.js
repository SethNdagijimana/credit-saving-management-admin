import jwt from "jsonwebtoken"

export const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Auth token missing" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admins only" })
    }

    req.admin = decoded
    next()
  } catch (error) {
    console.error("Admin Auth Error:", error)
    res.status(401).json({ message: "Invalid or expired token" })
  }
}
