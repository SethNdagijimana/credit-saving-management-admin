import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { userAuthenticationAction } from "../../actions/login/login-action"

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({ email: "", password: "", submit: "" })
  const [touched, setTouched] = useState({ email: false, password: false })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email address is required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required"
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    return ""
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: "" }))
    }

    if (touched[field]) {
      const error =
        field === "email" ? validateEmail(value) : validatePassword(value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const value = formData[field]
    const error =
      field === "email" ? validateEmail(value) : validatePassword(value)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const isFormValid = () => {
    return (
      formData.email.trim() !== "" &&
      formData.password !== "" &&
      !validateEmail(formData.email) &&
      !validatePassword(formData.password)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setTouched({ email: true, password: true })

    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        submit: ""
      })
      return
    }

    setLoading(true)
    setErrors({ email: "", password: "", submit: "" })

    try {
      const result = await dispatch(userAuthenticationAction(formData)).unwrap()

      if (result?.token && result?.user) {
        setFormData({ email: "", password: "" })
        navigate("/dashboard")
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: "Authentication failed. Please try again."
        }))
      }
    } catch (err) {
      let errorMessage = "An error occurred during login. Please try again."

      if (err?.response?.status === 401) {
        errorMessage =
          "Invalid email or password. Please check your credentials."
      } else if (err?.response?.status === 429) {
        errorMessage = "Too many login attempts. Please try again later."
      } else if (err?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later."
      } else if (err?.message) {
        errorMessage = err.message
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message
      }

      setErrors((prev) => ({ ...prev, submit: errorMessage }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-950 to-emerald-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                CJ
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              CREDIT JAMBO
            </h1>
            <h2 className="text-base sm:text-2xl font-semibold text-emerald-700 mb-2">
              Admin Portal
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Sign in to manage Credit Jambo
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-lg">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 ${
                    touched.email && errors.email
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                  } rounded-xl focus:ring-2 transition-all outline-none text-sm sm:text-base`}
                  placeholder="admin@creditjambo.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              {touched.email && errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-4 border-2 ${
                    touched.password && errors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                  } rounded-xl focus:ring-2 transition-all outline-none text-sm sm:text-base`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="w-full rounded-xl px-4 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
