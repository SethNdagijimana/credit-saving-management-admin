import { LogOut, User, X } from "lucide-react"
import { useEffect, useState } from "react"

const AppNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".profile-menu")) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("click", closeDropdown)
    return () => document.removeEventListener("click", closeDropdown)
  }, [])

  // const handleLogout = () => {
  //   dispatch({ type: LOGOUT })
  //   navigate("/")
  // }

  return (
    <div className="h-full flex flex-col">
      <div className="h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-lg md:text-2xl font-bold text-primary dark:text-white">
                Welcome to credit jambo
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">
              {/* {user.username || user.full_name} */} Seth
            </span>

            <div className="relative profile-menu">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-gray-500" />
                ) : (
                  <User className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                  <p className="md:hidden flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                    {/* {user.username} */} Admin
                  </p>
                  <button
                    // onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppNavBar
