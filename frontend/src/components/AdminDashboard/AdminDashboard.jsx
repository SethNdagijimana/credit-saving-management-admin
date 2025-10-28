import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7d")

  const userGrowthData = [
    { month: "Jan", users: 120, verified: 95, loans: 45 },
    { month: "Feb", users: 180, verified: 150, loans: 68 },
    { month: "Mar", users: 240, verified: 200, loans: 92 },
    { month: "Apr", users: 320, verified: 280, loans: 125 },
    { month: "May", users: 420, verified: 370, loans: 168 },
    { month: "Jun", users: 560, verified: 490, loans: 215 },
    { month: "Jul", users: 720, verified: 640, loans: 278 },
    { month: "Aug", users: 890, verified: 790, loans: 345 },
    { month: "Sep", users: 1050, verified: 940, loans: 425 },
    { month: "Oct", users: 1234, verified: 1100, loans: 520 }
  ]

  const loanDistribution = [
    { name: "Active", value: 520, color: "#10b981" },
    { name: "Completed", value: 336, color: "#3b82f6" },
    { name: "Pending", value: 89, color: "#f59e0b" },
    { name: "Defaulted", value: 23, color: "#ef4444" }
  ]

  const revenueData = [
    { month: "Jan", revenue: 2.5, interest: 0.8, fees: 0.3 },
    { month: "Feb", revenue: 3.8, interest: 1.2, fees: 0.5 },
    { month: "Mar", revenue: 5.2, interest: 1.8, fees: 0.7 },
    { month: "Apr", revenue: 7.1, interest: 2.4, fees: 0.9 },
    { month: "May", revenue: 9.8, interest: 3.5, fees: 1.2 },
    { month: "Jun", revenue: 13.2, interest: 4.8, fees: 1.6 },
    { month: "Jul", revenue: 17.5, interest: 6.2, fees: 2.1 },
    { month: "Aug", revenue: 22.8, interest: 8.1, fees: 2.7 },
    { month: "Sep", revenue: 29.4, interest: 10.5, fees: 3.5 },
    { month: "Oct", revenue: 38.2, interest: 13.8, fees: 4.6 }
  ]

  const verificationData = [
    { day: "Mon", verified: 12, pending: 5, rejected: 2 },
    { day: "Tue", verified: 15, pending: 8, rejected: 1 },
    { day: "Wed", verified: 18, pending: 6, rejected: 3 },
    { day: "Thu", verified: 14, pending: 9, rejected: 2 },
    { day: "Fri", verified: 22, pending: 12, rejected: 4 },
    { day: "Sat", verified: 8, pending: 4, rejected: 1 },
    { day: "Sun", verified: 6, pending: 3, rejected: 0 }
  ]

  const metrics = [
    {
      label: "Total Users",
      value: "1,234",
      change: "+18.2%",
      trend: "up",
      icon: "👥",
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "Active Loans",
      value: "520",
      change: "+12.5%",
      trend: "up",
      icon: "💰",
      color: "from-green-500 to-green-600"
    },
    {
      label: "Avg. Loan Size",
      value: "RWF 145K",
      change: "+8.3%",
      trend: "up",
      icon: "📊",
      color: "from-purple-500 to-purple-600"
    },
    {
      label: "Default Rate",
      value: "2.4%",
      change: "-0.8%",
      trend: "down",
      icon: "⚠️",
      color: "from-orange-500 to-orange-600"
    }
  ]

  const kpis = [
    { label: "Conversion Rate", value: "89.1%", target: "85%", progress: 92 },
    { label: "Avg. Approval Time", value: "4.2h", target: "6h", progress: 88 },
    {
      label: "Customer Satisfaction",
      value: "4.7/5",
      target: "4.5/5",
      progress: 94
    },
    { label: "Repayment Rate", value: "97.6%", target: "95%", progress: 97 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Comprehensive insights and performance metrics
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
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div
                  className={`bg-gradient-to-br ${metric.color} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-lg`}
                >
                  {metric.icon}
                </div>
                <div
                  className={`flex items-center space-x-1 text-xs sm:text-sm font-semibold ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span>{metric.trend === "up" ? "↑" : "↓"}</span>
                  <span>{metric.change}</span>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {metric.value}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* User Growth Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  User Growth
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  Total users and verification trends
                </p>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Total Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Verified</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorVerified"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="verified"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVerified)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Loan Distribution Pie Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Loan Status
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                Distribution by status
              </p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={loanDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {loanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 sm:space-y-3">
              {loanDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue and Verification Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Revenue Breakdown
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                Monthly revenue streams (Million RWF)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  style={{ fontSize: "11px" }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: "11px" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  name="Total Revenue"
                />
                <Bar
                  dataKey="interest"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  name="Interest"
                />
                <Bar
                  dataKey="fees"
                  fill="#f59e0b"
                  radius={[8, 8, 0, 0]}
                  name="Fees"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Verification Activity */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Verification Activity
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                Weekly verification trends
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={verificationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  stroke="#9ca3af"
                  style={{ fontSize: "11px" }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: "11px" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="verified"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  name="Verified"
                />
                <Bar
                  dataKey="pending"
                  fill="#f59e0b"
                  radius={[8, 8, 0, 0]}
                  name="Pending"
                />
                <Bar
                  dataKey="rejected"
                  fill="#ef4444"
                  radius={[8, 8, 0, 0]}
                  name="Rejected"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
            Key Performance Indicators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {kpis.map((kpi, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {kpi.label}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {kpi.value}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">
                    Target: {kpi.target}
                  </span>
                  <span className="text-xs text-green-600 font-semibold">
                    ✓ On Track
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${kpi.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="text-blue-600 text-2xl sm:text-3xl mb-3">📈</div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">
              Growth Trend
            </h3>
            <p className="text-gray-700 text-xs sm:text-sm mb-3">
              User growth increased by 18.2% this month, exceeding quarterly
              targets.
            </p>
            <button className="text-blue-600 font-semibold text-xs sm:text-sm hover:underline">
              View Details →
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="text-green-600 text-2xl sm:text-3xl mb-3">💡</div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">
              Best Performing
            </h3>
            <p className="text-gray-700 text-xs sm:text-sm mb-3">
              Loan approvals are processing 40% faster with 97.6% repayment
              rate.
            </p>
            <button className="text-green-600 font-semibold text-xs sm:text-sm hover:underline">
              View Details →
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="text-purple-600 text-2xl sm:text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">
              Action Needed
            </h3>
            <p className="text-gray-700 text-xs sm:text-sm mb-3">
              45 pending verifications require attention to maintain service
              quality.
            </p>
            <button className="text-purple-600 font-semibold text-xs sm:text-sm hover:underline">
              Review Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
