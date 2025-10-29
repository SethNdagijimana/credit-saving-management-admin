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

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiCall.get("/users")

      console.log("data==>", data)

      return data.users || []
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to fetch users"
      )
    }
  }
)
export const fetchUnverifiedUsers = createAsyncThunk(
  "users/fetchUnverifiedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiCall.get("/users/unverified")
      return data.users || []
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message)
    }
  }
)

export const verifyUser = createAsyncThunk(
  "users/verifyUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await apiCall.patch(`/users/${userId}/verify`)

      return data.user || { id: userId }
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message)
    }
  }
)

export const unverifyUser = createAsyncThunk(
  "users/unverifyUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await apiCall.patch(`/users/${userId}/unverify`)
      return data.user || { id: userId }
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message)
    }
  }
)

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await apiCall.delete(`/users/${userId}`)
      return { userId: data.userId ?? userId }
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message)
    }
  }
)

export const fetchNotifications = createAsyncThunk(
  "users/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiCall.get("/notifications")

      return data.notifications || []
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message)
    }
  }
)

export const fetchUserTransactions = createAsyncThunk(
  "users/fetchUserTransactions",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await apiCall.get(`/transactions?userId=${userId}`)
      return { userId, transactions: data.transactions || [] }
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message)
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
