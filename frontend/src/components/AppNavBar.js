import { Bell, LogOut, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { LOGOUT } from "../actions/login/login-action"

const AppNavBar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const { user, notifications = [] } = useSelector(
    (state) => state.app.userMngmt || {}
  )

  const [localUnread, setLocalUnread] = useState(new Set())

  useEffect(() => {
    const s = new Set(
      (notifications || []).filter((n) => !n.is_read).map((n) => n.id)
    )
    setLocalUnread(s)
  }, [notifications])

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".profile-menu")) {
        setIsProfileOpen(false)
      }

      if (
        !e.target.closest(".notif-menu") &&
        !e.target.closest(".notif-button")
      ) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("click", closeDropdown)
    return () => document.removeEventListener("click", closeDropdown)
  }, [])

  const handleLogout = () => {
    dispatch({ type: LOGOUT })
    navigate("/")
  }

  const unreadCount = localUnread.size

  const handleToggleNotifications = (e) => {
    e.stopPropagation()
    setShowNotifications((v) => !v)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-lg md:text-2xl font-bold text-primary dark:text-white">
                Welcome to Credit jambo
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications button */}
            <div className="relative notif-menu">
              <button
                onClick={handleToggleNotifications}
                className="notif-button relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={`Notifications (${unreadCount} unread)`}
                type="button"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification panel */}
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 sm:w-96 max-h-[70vh] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="flex items-center justify-between p-3 border-b">
                    <div>
                      <div className="text-sm font-semibold">Notifications</div>
                      <div className="text-xs text-gray-500">
                        Recent activities
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // mark all read locally
                          setLocalUnread(new Set())
                          // TODO: dispatch(markAllNotificationsRead())
                        }}
                        className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100"
                      >
                        Mark all
                      </button>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-auto max-h-[56vh]">
                    {!notifications || notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <ul className="divide-y">
                        {notifications
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.created_at) - new Date(a.created_at)
                          )
                          .map((n) => {
                            const isUnread = localUnread.has(n.id)
                            return (
                              <li
                                key={n.id}
                                className="p-3 hover:bg-gray-50 flex gap-3 items-start"
                              >
                                <div
                                  className={`flex-shrink-0 mt-1 ${
                                    isUnread
                                      ? "bg-indigo-50 p-2 rounded"
                                      : "bg-gray-100 p-2 rounded"
                                  }`}
                                >
                                  {/* icon by type */}
                                  {n.type === "withdraw" ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-gray-700"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v8m0 0l3-3m-3 3l-3-3"
                                      />
                                    </svg>
                                  ) : n.type === "deposit" ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-gray-700"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 16V8m0 0l3 3m-3-3l-3 3"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-gray-700"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m4 0h1"
                                      />
                                    </svg>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <div
                                        className={`text-sm font-medium truncate ${
                                          isUnread
                                            ? "text-gray-900"
                                            : "text-gray-700"
                                        }`}
                                      >
                                        {n.user_name ?? n.email}
                                      </div>
                                      <div className="text-xs text-gray-500 truncate mt-0.5">
                                        {n.message}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                      </ul>
                    )}
                  </div>

                  <div className="p-3 border-t flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Showing {notifications.length} notifications
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-xs px-3 py-1 rounded bg-gray-50 hover:bg-gray-100"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">
              {user?.name}
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
                    {user?.name}
                  </p>
                  <button
                    onClick={handleLogout}
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
