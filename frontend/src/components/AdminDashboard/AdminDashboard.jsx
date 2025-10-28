import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import {
  fetchAllUsers,
  fetchNotifications,
  fetchUnverifiedUsers
} from "../../actions/login/login-action"

const safeDate = (v) => {
  if (!v) return null
  const d = new Date(v)
  return isNaN(d) ? null : d
}

const monthLabel = (date) =>
  date.toLocaleString(undefined, { month: "short", year: "numeric" })

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const users = useSelector((s) => s.app?.userMngmt?.users ?? [])
  const unverified = useSelector((s) => s.app?.userMngmt?.unverified ?? [])
  const notifications = useSelector(
    (s) => s.app?.userMngmt?.notifications ?? []
  )
  const loading = useSelector((s) => s.app?.userMngmt?.loading ?? false)
  const error = useSelector((s) => s.app?.userMngmt?.error ?? null)

  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    dispatch(fetchAllUsers())
    dispatch(fetchUnverifiedUsers())
    dispatch(fetchNotifications())
  }, [dispatch])

  const { totalUsers, verifiedCount, pendingCountComputed } = useMemo(() => {
    if (!Array.isArray(users) || users.length === 0) {
      return { totalUsers: 0, verifiedCount: 0, pendingCountComputed: 0 }
    }

    // helper to safely get nested user object if backend wraps
    const unwrap = (u) => {
      if (!u) return null
      // if structure is { user: { ... } } or { data: { user: {...} } }
      if (u.user && typeof u.user === "object") return u.user
      if (u.data && u.data.user && typeof u.data.user === "object")
        return u.data.user
      return u
    }

    // normalize a single user object into consistent shape
    const normalize = (raw) => {
      const u = unwrap(raw)
      if (!u) return null

      const id = u.id ?? u._id ?? u.userId ?? null
      const email = u.email ?? u.email_address ?? null

      // various ways verified might be represented
      const verifiedCandidates = [
        u.isVerified,
        u.verified,
        u.is_verified,
        u.verification_status,
        u.status // sometimes 'verified' string stored here
      ]

      let isVerified = false
      for (const v of verifiedCandidates) {
        if (v === true) {
          isVerified = true
          break
        }
        if (v === 1 || v === "1") {
          isVerified = true
          break
        }
        if (typeof v === "string" && v.toLowerCase() === "true") {
          isVerified = true
          break
        }
        if (typeof v === "string" && v.toLowerCase() === "verified") {
          isVerified = true
          break
        }
      }

      return {
        id,
        email,
        isVerified
      }
    }

    // dedupe by id OR email (id preferred)
    const map = new Map()
    for (const raw of users) {
      const u = normalize(raw)
      if (!u) continue
      const key = u.id ?? u.email ?? JSON.stringify(u) // last resort
      if (!map.has(key)) {
        map.set(key, u)
      } else {
        // if duplicate exists, prefer marking verified true if any duplicate is verified
        const existing = map.get(key)
        if (!existing.isVerified && u.isVerified) {
          map.set(key, u)
        }
      }
    }

    const deduped = Array.from(map.values())
    const total = deduped.length
    const verified = deduped.reduce((acc, x) => acc + (x.isVerified ? 1 : 0), 0)
    const pending = Math.max(0, total - verified)

    // DEBUG: temporarily log counts so you can see what's being computed (remove in prod)
    // console.log("raw users length:", users.length, "deduped length:", total, "verified:", verified)

    return {
      totalUsers: total,
      verifiedCount: verified,
      pendingCountComputed: pending
    }
  }, [users])

  const unverifiedCount =
    Array.isArray(unverified) && unverified.length > 0
      ? unverified.length
      : pendingCountComputed

  const userGrowthData = useMemo(() => {
    const monthsBack = 9
    const map = new Map()
    users.forEach((u) => {
      const d = safeDate(
        u.createdAt || u.created_at || u.signupDate || u.created
      )
      if (!d) return
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`
      const rec = map.get(key) || { users: 0, verified: 0 }
      rec.users += 1
      if (u.isVerified || u.verified) rec.verified += 1
      map.set(key, rec)
    })

    const out = []
    const now = new Date()
    for (let i = monthsBack; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`
      const rec = map.get(key) || { users: 0, verified: 0 }
      out.push({
        month: monthLabel(d),
        users: rec.users,
        verified: rec.verified
      })
    }
    return out
  }, [users])

  const verificationData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const init = days.map((d) => ({
      day: d,
      verified: 0,
      pending: 0,
      rejected: 0
    }))

    const now = new Date()
    const dayIndex = (now.getDay() + 6) % 7
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - dayIndex)
    weekStart.setHours(0, 0, 0, 0)

    users.forEach((u) => {
      const when =
        safeDate(u.verifiedAt) ||
        safeDate(u.updatedAt) ||
        safeDate(u.updated_at) ||
        safeDate(u.createdAt) ||
        safeDate(u.created_at)
      if (!when) return
      if (when < weekStart) return
      const idx = (when.getDay() + 6) % 7
      const bucket = init[idx]

      if (u.reviewStatus === "rejected" || u.status === "rejected")
        bucket.rejected += 1
      else if (u.isVerified || u.verified) bucket.verified += 1
      else bucket.pending += 1
    })

    return init
  }, [users])

  const recentNotifications = useMemo(() => {
    return (notifications ?? [])
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 6)
  }, [notifications])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Live insights from users and notifications
            </p>
          </div>

          <div className="flex flex-wrap gap-2 bg-white rounded-xl shadow-sm p-1">
            {[
              { label: "7 Days", value: "7d" },
              { label: "30 Days", value: "30d" },
              { label: "90 Days", value: "90d" },
              { label: "1 Year", value: "1y" }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                  timeRange === range.value
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="mb-6 p-4 bg-white rounded-xl shadow-sm text-sm text-gray-600">
            Loading data…
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {String(error)}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-xs text-gray-500">Total Users</div>
            <div className="text-2xl font-bold">
              {totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Total users</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-xs text-gray-500">Verified Users</div>
            <div className="text-2xl font-bold">
              {verifiedCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Total Verified</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-xs text-gray-500">Unverified</div>
            <div className="text-2xl font-bold">
              {unverifiedCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Total Unverified</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-xs text-gray-500">Notifications</div>
            <div className="text-2xl font-bold">
              {(notifications?.length ?? 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Total notifications
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">User Growth</h2>
                <p className="text-gray-500 text-sm">
                  Monthly signups (computed client-side)
                </p>
              </div>
            </div>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gVerified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    fill="url(#gUsers)"
                  />
                  <Area
                    type="monotone"
                    dataKey="verified"
                    stroke="#10b981"
                    fill="url(#gVerified)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-primary mb-3">
              Recent Notifications
            </h3>
            {recentNotifications.length === 0 ? (
              <div className="text-sm text-gray-500">No notifications</div>
            ) : (
              <ul className="space-y-3">
                {recentNotifications.map((n) => (
                  <li key={n.id} className="border rounded p-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-semibold">
                          {n.user_name ?? n.email}
                        </div>
                        <div className="text-xs text-gray-600">{n.message}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(n.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Type: {n.type}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">
              Weekly Verification Activity
            </h3>
            <div className="text-sm text-gray-500">Mon → Sun</div>
          </div>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={verificationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#014620" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="verified" name="Verified" fill="#10b981" />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" />
                <Bar dataKey="rejected" name="Rejected" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <h4 className="font-bold">Quick Actions</h4>
            <p className="text-sm text-gray-600 mt-2">
              You can Verify or unverify Users in Verifications Tab.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <h4 className="font-bold">Data Source</h4>
            <p className="text-sm text-gray-600 mt-2">
              This dashboard Only Showcase Recent Activities
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <h4 className="font-bold">Notes</h4>
            <p className="text-sm text-gray-600 mt-2">
              Revenue & loan charts To be Implemented.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
