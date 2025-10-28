const Navbar = ({ title = "Dashboard" }) => {
  return (
    <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-dark">{title}</h1>
        <p className="text-sm text-gray-500">Welcome back, Admin</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-green=700 focus:outline-none"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-700 rounded-full"></span>
        </button>
      </div>
    </div>
  )
}

export default Navbar
