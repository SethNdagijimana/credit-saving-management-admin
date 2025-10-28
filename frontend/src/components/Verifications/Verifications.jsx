import { useState } from "react"

const Verifications = () => {
  const [unverifiedUsers, setUnverifiedUsers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      device_id: "abc123def456ghi789jkl012mno345pqr678",
      created_at: "2024-10-27T10:30:00Z"
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.williams@example.com",
      device_id: "xyz987wvu654tsr321ponm098lkj765ihg432",
      created_at: "2024-10-27T14:20:00Z"
    },
    {
      id: 3,
      name: "Carol Martinez",
      email: "carol.m@example.com",
      device_id: "def246ace135bdf024ghi357jkl680mno913",
      created_at: "2024-10-28T08:15:00Z"
    }
  ])
  const [loading, setLoading] = useState(false)

  const handleVerify = (userId) => {
    // Remove from list after verification
    setUnverifiedUsers(unverifiedUsers.filter((u) => u.id !== userId))
    alert("User verified successfully!")
  }

  const handleReject = (userId) => {
    // Remove from list after rejection
    setUnverifiedUsers(unverifiedUsers.filter((u) => u.id !== userId))
    alert("User rejected")
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Pending Device Verifications
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {unverifiedUsers.length} user
              {unverifiedUsers.length !== 1 ? "s" : ""} waiting for approval
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-gray-700 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm border border-gray-200 text-sm sm:text-base"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-16 sm:py-20">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-sm sm:text-base">
                Loading...
              </p>
            </div>
          ) : unverifiedUsers.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="text-5xl sm:text-6xl mb-4">✅</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                All Caught Up!
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                No pending verifications at the moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {unverifiedUsers.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white flex-shrink-0 shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                          {user.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm truncate">
                          {user.email}
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="text-gray-500 text-xs flex items-start sm:items-center gap-1 flex-wrap">
                            <span className="font-medium">Device ID:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                              {user.device_id.substring(0, 20)}...
                            </code>
                          </p>
                          <p className="text-gray-500 text-xs">
                            <span className="font-medium">Registered:</span>{" "}
                            {new Date(user.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row gap-2 sm:gap-3 lg:flex-shrink-0">
                      <button
                        onClick={() => handleVerify(user.id)}
                        className="flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all shadow-sm text-sm sm:text-base"
                      >
                        ✓ Verify
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all shadow-sm text-sm sm:text-base"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="text-blue-600 text-2xl sm:text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">
              Quick Verification
            </h3>
            <p className="text-gray-700 text-xs sm:text-sm">
              Review user details and device information before approving
              access.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="text-green-600 text-2xl sm:text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">
              Secure Process
            </h3>
            <p className="text-gray-700 text-xs sm:text-sm">
              Each device is verified to ensure account security and prevent
              fraud.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="text-purple-600 text-2xl sm:text-3xl mb-3">📊</div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">
              Track Activity
            </h3>
            <p className="text-gray-700 text-xs sm:text-sm">
              Monitor verification trends in the Analytics dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Verifications
