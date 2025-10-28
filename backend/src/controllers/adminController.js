import { loginAdminService } from "../services/adminAuthService.js"

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const { token, admin } = await loginAdminService(email, password)

    res.json({
      message: "Admin login successful",
      token,
      admin
    })
  } catch (error) {
    console.error("Admin login error:", error.message)
    res.status(400).json({ message: error.message })
  }
}
