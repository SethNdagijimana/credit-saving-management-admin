import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { initializeAuth } from "../slices/user_management_slice"
import Loading from "./Loading"

function ProtectedRoute({ children, requiredType }) {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const location = useLocation()

  const { isAuthenticated, user } = useSelector(
    (state) => state.app.userMngmt || {}
  )

  useEffect(() => {
    dispatch(initializeAuth())
    setIsLoading(false)
  }, [dispatch])

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  const allowedTypes = Array.isArray(requiredType)
    ? requiredType
    : [requiredType]

  if (requiredType && !allowedTypes.includes(user?.role)) {
    console.log("Access denied:", {
      userType: user?.role,
      allowedTypes
    })
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
