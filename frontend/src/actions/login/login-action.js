import { createAsyncThunk } from "@reduxjs/toolkit"
import apiCall from "../../helper/http"
import { logout } from "../../slices/user_management_slice"

export const userAuthenticationAction = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await apiCall.post("/admin/login", credentials)

      const token = data?.token
      const user = data?.admin

      if (!token || !user) {
        return rejectWithValue({ message: "Invalid login response" })
      }

      user.role = "admin"

      localStorage.clear()
      localStorage.setItem("accessToken", token)
      localStorage.setItem("user", JSON.stringify(user))

      return { user, token }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed, please try again."
      return rejectWithValue({ message })
    }
  }
)

export const logoutAction = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")

    dispatch(logout())

    dispatch({ type: "LOGOUT" })
  }
)

export const LOGOUT = "LOGOUT"
