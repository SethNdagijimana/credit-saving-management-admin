import axios from "axios"
const url = process.env.REACT_APP_BASE_URL

let isRefreshing = false
let failedQueue = []
let store = null

export const setStore = (storeInstance) => {
  store = storeInstance
}

const processQueue = (error, tokens = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(tokens)
    }
  })
  failedQueue = []
}

const apiCall = axios.create({
  baseURL: url,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
})

apiCall.interceptors.request.use(
  async (config) => {
    let accessToken = null
    if (store) {
      try {
        const state = store.getState()
        accessToken = state.app?.userMngmt?.tokens?.access
      } catch (error) {
        console.warn("Could not get token from Redux state:", error)
      }
    }

    if (!accessToken) {
      accessToken = localStorage.getItem("accessToken")
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// apiCall.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject })
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`
//             return apiCall(originalRequest)
//           })
//           .catch((err) => Promise.reject(err))
//       }

//       originalRequest._retry = true
//       isRefreshing = true

//       try {
//         const refreshToken = localStorage.getItem("refreshToken")
//         if (!refreshToken) throw new Error("No refresh token")

//         const response = await axios.post(`${url}/auth/refresh/`, {
//           refresh: refreshToken
//         })

//         const newAccessToken = response.data.access
//         localStorage.setItem("accessToken", newAccessToken)

//         processQueue(null, newAccessToken)

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
//         return apiCall(originalRequest)
//       } catch (refreshError) {
//         processQueue(refreshError, null)

//         localStorage.removeItem("accessToken")
//         // localStorage.removeItem("refreshToken")
//         localStorage.removeItem("user")

//         window.location.href = "/login"

//         return Promise.reject(refreshError)
//       } finally {
//         isRefreshing = false
//       }
//     }

//     return Promise.reject(error)
//   }
// )

export default apiCall
