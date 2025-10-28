import { useState } from "react"

const Accounts = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, verified, unverified

  const filteredUsers = users.filter((user) => {
    if (filter === "verified") return user.verified
    if (filter === "unverified") return !user.verified
    return true
  })

  return (
    <div className="flex h-screen bg-gray-500/50">
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <h3 className="text-3xl font-display font-bold text-dark-500 mb-1">
                {users.length}
              </h3>
              <p className="text-gray-600">Total Users</p>
            </div>
            <div className="card">
              <h3 className="text-3xl font-display font-bold text-green-600 mb-1">
                {users.filter((u) => u.verified).length}
              </h3>
              <p className="text-gray-600">Verified Users</p>
            </div>
            <div className="card">
              <h3 className="text-3xl font-display font-bold text-yellow-600 mb-1">
                {users.filter((u) => !u.verified).length}
              </h3>
              <p className="text-gray-600">Pending Verification</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text--dark-500">
                All Users
              </h2>

              {/* Filter Tabs */}
              <div className="flex space-x-2">
                {["all", "verified", "unverified"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                      filter === tab
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                        Device ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                        Joined
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 font-medium">#{user.id}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-4 px-4">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {user.device_id.substring(0, 8)}...
                          </code>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.verified
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {user.verified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            {user.verified ? (
                              <button className="text-yellow-600 hover:underline text-sm font-semibold">
                                Unverify
                              </button>
                            ) : (
                              <button className="text-green-500 hover:underline text-sm font-semibold">
                                Verify
                              </button>
                            )}
                            <button className="text-red-600 hover:underline text-sm font-semibold">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Accounts
