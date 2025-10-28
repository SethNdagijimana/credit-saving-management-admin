import { Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  deleteUser,
  fetchUnverifiedUsers,
  verifyUser
} from "../../actions/login/login-action"
import ConfirmDeleteModal from "../Accounts/ConfirmDeleteModal"

const Verifications = () => {
  const dispatch = useDispatch()
  const storeUsers = useSelector((state) => state.app?.userMngmt?.users || [])
  const usersLoading = useSelector(
    (state) => state.app?.userMngmt?.usersLoading
  )
  const usersError = useSelector((state) => state.app?.userMngmt?.usersError)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchUnverifiedUsers())
  }, [dispatch])

  const users = useMemo(
    () =>
      (storeUsers || []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        device_id: u.deviceId ?? u.device_id ?? "-",
        created_at: u.createdAt ?? u.created_at ?? null,

        _raw: u
      })),
    [storeUsers]
  )

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.device_id || "").toLowerCase().includes(q) ||
        String(u.id).includes(q)
    )
  }, [users, searchQuery])

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  const handleVerify = async (userId) => {
    setActionLoadingId(userId)
    try {
      await dispatch(verifyUser(userId)).unwrap()
      await dispatch(fetchUnverifiedUsers())
    } catch (err) {
      console.error("Verify failed:", err)
      alert(err?.message || "Verify failed")
    } finally {
      setActionLoadingId(null)
    }
  }

  const openRejectConfirm = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleRejectConfirmed = async () => {
    if (!userToDelete) return
    setActionLoadingId(userToDelete.id)
    try {
      await dispatch(deleteUser(userToDelete.id)).unwrap()
      await dispatch(fetchUnverifiedUsers())
      setShowDeleteModal(false)
      setUserToDelete(null)
    } catch (err) {
      console.error("Delete failed:", err)
      alert(err?.message || "Delete failed")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleBulkVerify = async () => {
    if (selectedIds.size === 0) return
    setBulkLoading(true)
    try {
      for (const id of Array.from(selectedIds)) {
        await dispatch(verifyUser(id)).unwrap()
      }
      await dispatch(fetchUnverifiedUsers())
      clearSelection()
    } catch (err) {
      console.error("Bulk verify failed:", err)
      alert(err?.message || "Bulk verify failed")
    } finally {
      setBulkLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Pending Device Verifications
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {users.length} user{users.length !== 1 ? "s" : ""} waiting for
              approval
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, device id..."
                className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 outline-none w-72 text-sm"
              />
            </div>

            <button
              onClick={() => dispatch(fetchUnverifiedUsers())}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              🔄 Refresh
            </button>

            <button
              onClick={handleBulkVerify}
              disabled={selectedIds.size === 0 || bulkLoading}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50"
            >
              {bulkLoading
                ? "Verifying..."
                : `Verify selected (${selectedIds.size})`}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          {usersLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading unverified users...</p>
            </div>
          ) : usersError ? (
            <div className="text-red-600 p-4 rounded">{usersError}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-bold mb-2">All caught up</h3>
              <p className="text-gray-600">No pending verifications.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((u) => (
                <div
                  key={u.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(u.id)}
                      onChange={() => toggleSelect(u.id)}
                      className="mt-1"
                    />
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {u.name}
                          </div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            <span className="font-medium">Device:</span>{" "}
                            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                              {u.device_id}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerify(u.id)}
                        disabled={actionLoadingId === u.id}
                        className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                      >
                        {actionLoadingId === u.id ? "Verifying..." : "Verify"}
                      </button>

                      <button
                        onClick={() => openRejectConfirm(u)}
                        disabled={actionLoadingId === u.id}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Reject user"
        message={`Are you sure you want to reject and delete ${
          userToDelete?.name || "this user"
        }? This action cannot be undone.`}
        onCancel={() => {
          setShowDeleteModal(false)
          setUserToDelete(null)
        }}
        onConfirm={handleRejectConfirmed}
        loading={actionLoadingId === userToDelete?.id}
      />
    </div>
  )
}

export default Verifications
