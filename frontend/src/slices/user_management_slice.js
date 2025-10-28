import { createSlice } from "@reduxjs/toolkit"
import {
  deleteUser,
  fetchAllUsers,
  fetchNotifications,
  fetchUnverifiedUsers,
  unverifyUser,
  userAuthenticationAction,
  verifyUser
} from "../actions/login/login-action"

const checkAuth = () => {
  const accessToken = localStorage.getItem("accessToken")
  const user = localStorage.getItem("user")
  return !!(accessToken && user)
}

const getStoredTokens = () => ({
  access: localStorage.getItem("accessToken"),
  refresh: localStorage.getItem("refreshToken") || null
})

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error("Error parsing stored user:", error)
    return null
  }
}

const initialState = {
  tokens: getStoredTokens(),
  user: getStoredUser(),
  isAuthenticated: checkAuth(),
  loading: false,
  success: false,
  error: false,

  users: [],
  usersLoading: false,
  usersError: null,

  notifications: [],
  notificationsLoading: false,
  notificationsError: null,

  actionLoading: false
}

const userManagementSlice = createSlice({
  name: "userMngmt",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const accessToken = localStorage.getItem("accessToken")
      const user = localStorage.getItem("user")

      if (accessToken && user) {
        try {
          const refreshToken = localStorage.getItem("refreshToken")
          state.tokens = refreshToken
            ? { access: accessToken, refresh: refreshToken }
            : { access: accessToken, refresh: null }
          state.user = JSON.parse(user)
          state.isAuthenticated = true
        } catch (error) {
          console.error("Error parsing user from localStorage:", error)
          state.tokens = { access: null, refresh: null }
          state.user = null
          state.isAuthenticated = false
        }
      } else {
        state.tokens = { access: null, refresh: null }
        state.user = null
        state.isAuthenticated = false
      }
    },

    initializeSystemUser: (state) => {
      return {
        ...initialState,
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated
      }
    },

    logout: (state) => {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      return {
        ...initialState,
        isAuthenticated: false,
        user: null,
        tokens: { access: null, refresh: null }
      }
    },

    clearError: (state) => {
      state.error = false
      state.message = ""
      state.errorCode = ""
    }
  },

  extraReducers: (builder) => {
    builder
      /* --- auth login flow --- */
      .addCase(userAuthenticationAction.pending, (state) => {
        state.loading = true
        state.error = false
        state.success = false
      })
      .addCase(userAuthenticationAction.fulfilled, (state, action) => {
        const { user, token } = action.payload
        state.loading = false
        state.success = true
        state.error = false
        state.user = user
        state.tokens = { ...state.tokens, access: token }
        state.isAuthenticated = true
      })
      .addCase(userAuthenticationAction.rejected, (state) => {
        state.loading = false
        state.error = true
        state.success = false
        state.isAuthenticated = false
      })

      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true
        state.usersError = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false
        state.users = action.payload
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false
        state.usersError =
          action.payload || action.error?.message || "Failed to fetch users"
      })

      .addCase(fetchUnverifiedUsers.pending, (state) => {
        state.usersLoading = true
        state.usersError = null
      })
      .addCase(fetchUnverifiedUsers.fulfilled, (state, action) => {
        state.usersLoading = false
        state.users = action.payload
      })
      .addCase(fetchUnverifiedUsers.rejected, (state, action) => {
        state.usersLoading = false
        state.usersError = action.payload || action.error?.message
      })

      .addCase(verifyUser.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.actionLoading = false
        const updated = action.payload
        state.users = state.users.map((u) =>
          u.id === updated.id ? { ...u, verified: true, ...updated } : u
        )
      })
      .addCase(verifyUser.rejected, (state) => {
        state.actionLoading = false
      })

      .addCase(unverifyUser.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(unverifyUser.fulfilled, (state, action) => {
        state.actionLoading = false
        const updated = action.payload
        state.users = state.users.map((u) =>
          u.id === updated.id ? { ...u, verified: false, ...updated } : u
        )
      })
      .addCase(unverifyUser.rejected, (state) => {
        state.actionLoading = false
      })

      .addCase(deleteUser.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionLoading = false
        const { userId } = action.payload
        state.users = state.users.filter((u) => u.id !== userId)
      })
      .addCase(deleteUser.rejected, (state) => {
        state.actionLoading = false
      })

      .addCase(fetchNotifications.pending, (state) => {
        state.notificationsLoading = true
        state.notificationsError = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notificationsLoading = false
        state.notifications = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.notificationsLoading = false
        state.notificationsError = action.payload || action.error?.message
      })
  }
})

export const { initializeSystemUser, logout, initializeAuth, clearError } =
  userManagementSlice.actions
export default userManagementSlice.reducer
