import { X } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"

const TransactionModal = ({ user, onClose }) => {
  const {
    transactions = [],
    transactionsLoading,
    transactionsError
  } = useSelector((state) => state.app?.userMngmt || {})

  const [currentPage, setCurrentPage] = useState(1)
  const transactionsPerPage = 3

  useEffect(() => {
    setCurrentPage(1)
  }, [transactions])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const indexOfLast = currentPage * transactionsPerPage
  const indexOfFirst = indexOfLast - transactionsPerPage
  const currentTransactions = useMemo(
    () => transactions.slice(indexOfFirst, indexOfLast),
    [transactions, indexOfFirst, indexOfLast]
  )

  const totalPages = Math.ceil((transactions.length || 0) / transactionsPerPage)

  const escapeCSV = (value) => {
    if (value == null) return ""
    const str = String(value)
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const exportCSV = useCallback(() => {
    if (!transactions || transactions.length === 0) return

    const headers = [
      "ID",
      "Type",
      "Amount",
      "Account Number",
      "Description",
      "Balance",
      "Date"
    ]

    const rows = transactions.map((tx) => [
      escapeCSV(tx.id),
      escapeCSV(tx.type),
      escapeCSV(tx.amount),
      escapeCSV(tx.account_number),
      escapeCSV(tx.description),
      escapeCSV(tx.new_balance),
      escapeCSV(new Date(tx.created_at || tx.createdAt).toLocaleString())
    ])

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${user.name.replace(
      /[^a-z0-9]/gi,
      "_"
    )}_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [transactions, user.name])

  const formatAmount = useCallback((tx) => {
    const isDeposit = tx.type === "deposit"
    return (
      <span
        className={
          isDeposit
            ? "text-green-600 font-semibold"
            : "text-red-600 font-semibold"
        }
      >
        {isDeposit ? "+" : "-"} RWF {tx.amount?.toLocaleString()}
      </span>
    )
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-lg font-bold">
            Transactions for {user.name}{" "}
            {transactions.length > 0 && `(${transactions.length})`}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              disabled={!transactions || transactions.length === 0}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Export transactions to CSV"
            >
              Export CSV
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="hover:bg-gray-100 p-1 rounded transition"
            >
              <X className="w-6 h-6 text-gray-700 hover:text-red-600" />
            </button>
          </div>
        </div>

        {transactionsLoading ? (
          <p className="text-center py-6 text-gray-600">Loading...</p>
        ) : transactionsError ? (
          <p className="text-center py-6 text-red-600">
            Error loading transactions: {transactionsError}
          </p>
        ) : transactions.length === 0 ? (
          <p className="text-center py-6 text-gray-500">
            No transactions found
          </p>
        ) : (
          <>
            <div className="overflow-auto max-h-96 border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr className="font-semibold text-gray-700">
                    <th className="py-2 px-2 text-left">Type</th>
                    <th className="py-2 px-2 text-left">Amount</th>
                    <th className="py-2 px-2 text-left">Account</th>
                    <th className="py-2 px-2 text-left">Description</th>
                    <th className="py-2 px-2 text-left">Balance</th>
                    <th className="py-2 px-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2 capitalize">{tx.type}</td>
                      <td className="py-2 px-2">{formatAmount(tx)}</td>
                      <td className="py-2 px-2">{tx.account_number || "-"}</td>
                      <td className="py-2 px-2">{tx.description || "-"}</td>
                      <td className="py-2 px-2">
                        {tx.new_balance
                          ? `RWF ${parseFloat(tx.new_balance).toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="py-2 px-2">
                        {new Date(
                          tx.created_at || tx.createdAt
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-1 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="Previous page"
                >
                  Previous
                </button>

                <span>
                  Page <b>{currentPage}</b> of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TransactionModal
