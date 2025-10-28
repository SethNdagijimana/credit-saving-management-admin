import { ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

const THEMES = {
  default: {
    sidebar: "from-emerald-500/20 to-emerald-900",

    text: "text-white",
    activeItem: "bg-white text-slate-800 dark:text-slate-800",
    hover: "hover:bg-white/10",
    border: "border-white/10",
    disabled: "opacity-50 cursor-not-allowed"
  },
  blue: {
    sidebar: "from-blue-600 to-blue-900",
    text: "text-white",
    activeItem: "bg-blue-100 text-blue-900 dark:bg-blue-100 dark:text-blue-900",
    hover: "hover:bg-blue-700/30",
    border: "border-blue-400/20",
    disabled: "opacity-50 cursor-not-allowed"
  },
  green: {
    sidebar: "from-emerald-500/20 via-emerald-800 to-emerald-900",

    text: "text-white",
    activeItem: "bg-white text-emerald-700 shadow-lg shadow-emerald-500/20",
    hover: "hover:bg-white/10",
    border: "border-emerald-400/20",
    disabled: "opacity-50 cursor-not-allowed",
    accent: "bg-emerald-500/20"
  }
}

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
}

const DashboardLayout = ({
  children,
  menuItems,
  title = "CREDITJAMBO",
  variant = "default",
  theme = "green",
  breakpoint = "md",
  initialSidebarState = true,
  sidebarWidth = {
    collapsed: "w-20",
    expanded: "w-64",
    mobile: "w-[280px]"
  }
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialSidebarState)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isHeaderSticky, setHeaderSticky] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const location = useLocation()
  const themeColors = THEMES[theme] || THEMES.green

  useEffect(() => {
    let resizeTimer
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const mobile = window.innerWidth < BREAKPOINTS[breakpoint]
        setIsMobile(mobile)
        if (!mobile) {
          setIsSidebarOpen(true)
        }
      }, 100)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimer)
    }
  }, [breakpoint])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setHeaderSticky(currentScrollY < lastScrollY || currentScrollY < 50)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobile, isSidebarOpen])

  const sidebarWidthClass = isMobile
    ? sidebarWidth.mobile
    : isSidebarCollapsed
    ? sidebarWidth.collapsed
    : sidebarWidth.expanded

  const mainContentClass = isMobile
    ? ""
    : `${isSidebarCollapsed ? "md:pl-20" : "md:pl-64"}`

  const handleMenuItemClick = (menu) => {
    if (menu.disabled) return
    if (isMobile) setIsSidebarOpen(false)
  }

  const shouldShowMenuText = () => {
    if (isMobile) return true
    return !isSidebarCollapsed
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0
          bg-[#00150a]
          transform transition-all duration-300 ease-in-out
          ${sidebarWidthClass}
          ${
            isMobile
              ? isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
          shadow-2xl z-50 border-r border-white/10
        `}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-900/20 pointer-events-none"></div>

        <div className="flex flex-col h-full relative z-10">
          <div
            className={`p-5 sm:p-6 border-b ${themeColors.border} flex items-center justify-between backdrop-blur-sm`}
          >
            <div className="flex items-center justify-center">
              {(isMobile || !isSidebarCollapsed) && (
                <div>
                  <h1
                    className={`text-lg sm:text-xl font-bold ${themeColors.text} tracking-wide`}
                  >
                    {title}
                  </h1>
                  <p className="text-emerald-200/60 text-xs text-center">
                    Admin Portal
                  </p>
                </div>
              )}
            </div>
            {!isMobile && (
              <button
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                className={`${themeColors.text} hover:bg-white/10 p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95`}
                aria-label={
                  isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
              >
                {isSidebarCollapsed ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
              </button>
            )}
          </div>

          {/* Navigation - Enhanced */}
          <nav className="flex-1 px-3 py-4 sm:py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <ul className="space-y-1.5">
              {menuItems.map((menu) => (
                <li key={menu.name}>
                  <Link
                    to={menu.path}
                    onClick={() => handleMenuItemClick(menu)}
                    className={`
                      flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                      transition-all duration-200 group relative overflow-hidden
                      ${
                        location.pathname === menu.path
                          ? `${themeColors.activeItem} scale-[0.98]`
                          : `${themeColors.text} ${themeColors.hover} hover:scale-[0.99] hover:translate-x-1`
                      }
                      ${menu.disabled ? themeColors.disabled : ""}
                    `}
                  >
                    {/* Active indicator bar */}
                    {location.pathname === menu.path && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full"></div>
                    )}

                    <span
                      className={`text-lg sm:text-xl flex-shrink-0 ${
                        !isMobile && isSidebarCollapsed ? "mx-auto" : ""
                      }`}
                    >
                      {menu.icon}
                    </span>

                    {shouldShowMenuText() && (
                      <span className="text-sm sm:text-base font-medium truncate group-hover:translate-x-0.5 transition-transform duration-200">
                        {menu.name}
                      </span>
                    )}

                    {/* Badge for notifications */}
                    {menu.badge && shouldShowMenuText() && (
                      <span className="ml-auto bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {menu.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer - Enhanced */}
          <div
            className={`p-4 border-t ${themeColors.border} bg-black/20 backdrop-blur-sm`}
          >
            {shouldShowMenuText() ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-200 text-xs sm:text-sm font-bold">
                      A
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs sm:text-sm font-medium truncate">
                      Admin User
                    </p>
                    <p className="text-emerald-200/60 text-[10px] sm:text-xs truncate">
                      admin@creditjambo.com
                    </p>
                  </div>
                </div>
                <div className=" text-xs text-white text-center pt-2 border-t ">
                  © CJ {new Date().getFullYear()}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                  <span className="text-emerald-200 text-xs font-bold">A</span>
                </div>
                <div className=" text-xs text-white">
                  {new Date().getFullYear()}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className={`flex-1 ${mainContentClass} transition-all duration-300`}>
        <header
          className={`
            sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90
            border-b border-gray-200 dark:border-gray-800
            backdrop-blur-xl transition-all duration-300
            ${isHeaderSticky ? "translate-y-0 shadow-sm" : "-translate-y-full"}
          `}
        >
          <div className="flex items-center h-14 sm:h-16 px-4 sm:px-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 dark:text-gray-300 mr-3 sm:mr-4 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-all active:scale-95"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex-1 overflow-hidden">{children.nav}</div>
          </div>
        </header>

        {/* Main Content Area - Enhanced */}
        <main className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children.content}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
