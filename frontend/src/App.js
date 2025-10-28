import React, { Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

const Admin = React.lazy(() => import("./pages/Dashboard/Admin"))
const LogIn = React.lazy(() => import("./pages/LoginPage/LoginPage"))

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" name="Login" element={<LogIn />} />
      <Route path="/dashboard/*" element={<Admin />} />
    </Routes>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
