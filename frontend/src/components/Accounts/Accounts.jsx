import { CheckCircle, Clock, Download, Eye, Search, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
  deleteUser,
  fetchAllUsers,
  unverifyUser,
  verifyUser
} from "../../actions/login/login-action"
import ConfirmDeleteModal from "./ConfirmDeleteModal"
import UserModal from "./UserModal"

const Accounts = () => {
  const dispatch = useDispatch()
  const usersFromStore = useSelector(
    (state) => state.app?.userMngmt?.users || []
  )
  const usersLoading = useSelector(
    (state) => state.app?.userMngmt?.usersLoading
  )

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(5)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [dispatch])

  const confirmDelete = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  useEffect(() => {
    setLoading(Boolean(usersLoading))

    const normalized = (usersFromStore || []).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      device_id: u.deviceId ?? u.device_id ?? "",
      phone_number: u.phone_number,
      verified: Boolean(u.verified),
      balance: u.balance ?? 0,
      created_at: u.createdAt ?? u.created_at ?? null,
      lastTransaction: u.lastTransaction ?? null,

      _raw: u
    }))
    setUsers(normalized)
  }, [usersFromStore, usersLoading])

  const filteredUsers = users.filter((user) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "verified"
        ? user.verified
        : !user.verified

    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !q ||
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.id.toString().includes(q)

    return matchesFilter && matchesSearch
  })

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage))

  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchQuery])

  const handleVerifyUser = async (userId, verify) => {
    setActionLoading(userId)
    try {
      if (verify) {
        await dispatch(verifyUser(userId)).unwrap()
      } else {
        await dispatch(unverifyUser(userId)).unwrap()
      }

      await dispatch(fetchAllUsers())

      setShowUserModal(false)
    } catch (err) {
      // show error (you can replace with toast)
      console.error("Verify/unverify failed:", err)
      alert(err?.message || "Action failed")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    setActionLoading(userToDelete.id)
    try {
      await dispatch(deleteUser(userToDelete.id)).unwrap()
      await dispatch(fetchAllUsers())
      setShowDeleteModal(false)
      setShowUserModal(false)
    } catch (err) {
      console.error("Delete failed:", err)
      alert(err?.message || "Delete failed")
    } finally {
      setActionLoading(null)
    }
  }

  const handleExportData = () => {
    const csv = [
      ["ID", "Name", "Email", "Phone Number", "Device ID", "Status", "Joined"],
      ...filteredUsers.map((u) => [
        u.id,
        u.name,
        u.email,
        u.phone_number,
        u.device_id,
        u.verified ? "Verified" : "Pending",
        u.created_at ? new Date(u.created_at).toLocaleDateString() : ""
      ])
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users-export.csv"
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            User Accounts
          </h1>
          <p className="text-gray-600">
            Manage and monitor all registered users
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Total
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {users.length}
            </h3>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Verified
              </span>
            </div>
            <h3 className="text-3xl font-bold text-emerald-600 mb-1">
              {users.filter((u) => u.verified).length}
            </h3>
            <p className="text-sm text-gray-600">Verified Users</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Pending
              </span>
            </div>
            <h3 className="text-3xl font-bold text-yellow-600 mb-1">
              {users.filter((u) => !u.verified).length}
            </h3>
            <p className="text-sm text-gray-600">Pending Verification</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                All Users ({filteredUsers.length})
              </h2>

              <button
                onClick={handleExportData}
                className="flex items-center justify-center px-4 py-2 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-sm"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {["all", "verified", "unverified"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-3 rounded-xl font-semibold capitalize transition-all whitespace-nowrap text-sm ${
                      filter === tab
                        ? "bg-emerald-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                <p className="text-gray-600 mt-4 font-medium">
                  Loading users...
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No users found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">
                      User
                    </th>
                    <th className="text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap hidden md:table-cell">
                      Balance
                    </th>
                    <th className="text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap hidden lg:table-cell">
                      Device ID
                    </th>
                    <th className="text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap hidden lg:table-cell">
                      Phone
                    </th>
                    <th className="text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Transaction
                    </th>
                    <th className="text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              #{user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm hidden md:table-cell">
                        <div className="flex items-center space-x-2">
                          <span>RWF</span>
                          <span className="truncate max-w-xs">
                            {user.balance}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 hidden lg:table-cell">
                        <code className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg font-mono text-gray-700">
                          {user.device_id
                            ? `${user.device_id.substring(0, 12)}...`
                            : "-"}
                        </code>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm hidden md:table-cell">
                        <div className="flex items-center space-x-2">
                          <span className="truncate max-w-xs">
                            {user.phone_number}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm hidden md:table-cell">
                        <div className="flex items-center space-x-2">
                          <span className="truncate max-w-xs">
                            {user.lastTransaction?.type
                              ? user.lastTransaction.type
                              : "-"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        <span
                          className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            user.verified
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.verified ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && filteredUsers.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirstUser + 1} to{" "}
                  {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                  {filteredUsers.length} users
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all text-sm ${
                              currentPage === pageNumber
                                ? "bg-emerald-500 text-white"
                                : "border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        )
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span
                            key={pageNumber}
                            className="px-2 py-2 text-gray-400"
                          >
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showUserModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowUserModal(false)}
          onVerify={handleVerifyUser}
          confirmDelete={confirmDelete}
          actionLoading={actionLoading}
        />
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete User"
        message={`Are you sure you want to delete ${
          userToDelete?.name || "this user"
        }? This action cannot be undone.`}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        loading={actionLoading === userToDelete?.id}
      />
    </div>
  )
}

export default Accounts
