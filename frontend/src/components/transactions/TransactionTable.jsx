const TransactionTable = ({ transactions, onDelete, onEdit }) => {
  if (transactions.length === 0) {
    return (
      <div className="glass-card p-12 text-center flex flex-col items-center justify-center border border-slate-200/40">
        <p className="text-slate-500 font-bold">No ledger records found.</p>
        <p className="text-xs text-slate-400 font-semibold mt-1.5 max-w-xs">
          Start recording transactions to analyze cashflows in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden border border-slate-200/40 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200/40">
              <th className="text-left px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Details</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flow Type</th>
              <th className="text-right px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="text-center px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-slate-50/40 transition-colors duration-200"
              >
                {/* Date */}
                <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                  {new Date(transaction.transaction_date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </td>

                {/* Details (Description) */}
                <td className="px-6 py-4 text-sm font-semibold text-slate-800 max-w-[200px] truncate">
                  {transaction.description || <span className="text-slate-400 font-normal italic">None</span>}
                </td>

                {/* Category */}
                <td className="px-6 py-4 text-xs font-bold text-slate-600">
                  <span className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200/20">
                    {transaction.category}
                  </span>
                </td>

                {/* Flow Type */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      transaction.type === "income"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200/20"
                        : "bg-rose-50 text-rose-600 border-rose-200/20"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>

                {/* Amount */}
                <td className={`px-6 py-4 text-right font-extrabold text-sm ${
                  transaction.type === "income" ? "text-emerald-600" : "text-slate-800"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}₹{Number(transaction.amount).toLocaleString("en-IN")}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors cursor-pointer"
                    >
                      Edit
                    </button>

                    <span className="text-slate-200">|</span>

                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
