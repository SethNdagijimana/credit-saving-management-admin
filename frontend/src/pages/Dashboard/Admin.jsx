import { Gauge, ShieldCheck, Users } from "lucide-react"
import { Route, Routes } from "react-router-dom"
import Accounts from "../../components/Accounts/Accounts"
import AdminDashboard from "../../components/AdminDashboard/AdminDashboard"
import AppNavBar from "../../components/AppNavBar"
import Verifications from "../../components/Verifications/Verifications"
import DashboardLayout from "./DashboardLayout"

const menuItems = [
  {
    name: "Dashboard",
    icon: <Gauge size={14} />,
    path: "/dashboard"
  },
  {
    name: "Verifications",
    icon: <ShieldCheck size={14} />,
    path: "/dashboard/verification"
  },
  {
    name: "Accounts",
    icon: <Users size={14} />,
    path: "/dashboard/accounts"
  }
]

const Admin = () => {
  return (
    <>
      <DashboardLayout
        menuItems={menuItems}
        title="Admin"
        variant="admin"
        breakpoint="lg"
        initialSidebarState={true}
      >
        {{
          nav: <AppNavBar />,
          content: (
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/verification" element={<Verifications />} />
              <Route path="/accounts" element={<Accounts />} />
            </Routes>
          )
        }}
      </DashboardLayout>
    </>
  )
}

export default Admin
