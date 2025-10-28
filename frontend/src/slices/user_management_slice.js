import { createSlice } from "@reduxjs/toolkit"

const checkAuth = () => {
  const accessToken = localStorage.getItem("accessToken")
  const refreshToken = localStorage.getItem("refreshToken")
  const user = localStorage.getItem("user")
  return !!(accessToken && refreshToken && user)
}

const getStoredTokens = () => {
  const accessToken = localStorage.getItem("accessToken")
  const refreshToken = localStorage.getItem("refreshToken")
  return {
    access: accessToken,
    refresh: refreshToken
  }
}

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
  error: false
}

const userManagementSlice = createSlice({
  name: "userMngmt",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const accessToken = localStorage.getItem("accessToken")
      const refreshToken = localStorage.getItem("refreshToken")
      const user = localStorage.getItem("user")

      if (accessToken && refreshToken && user) {
        try {
          state.tokens = { access: accessToken, refresh: refreshToken }
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

    updateTokens: (state, action) => {
      state.tokens.access = action.payload.access
      if (action.payload.refresh) {
        state.tokens.refresh = action.payload.refresh
      }
      state.isAuthenticated = true
      localStorage.setItem("accessToken", action.payload.access)
      if (action.payload.refresh) {
        localStorage.setItem("refreshToken", action.payload.refresh)
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
  }
})

export const {
  initializeSystemUser,
  logout,
  updateTokens,
  initializeAuth,
  clearError
} = userManagementSlice.actions
export default userManagementSlice.reducer
