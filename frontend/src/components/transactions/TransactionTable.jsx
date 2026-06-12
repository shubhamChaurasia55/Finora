const TransactionTable = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4">Date</th>

            <th className="text-left p-4">Category</th>

            <th className="text-left p-4">Type</th>

            <th className="text-left p-4">Amount</th>

            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t">
              <td className="p-4">
                {new Date(transaction.transaction_date).toLocaleDateString()}
              </td>

              <td className="p-4">{transaction.category}</td>

              <td className="p-4">
                <span
                  className={
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {transaction.type}
                </span>
              </td>

              <td className="p-4 font-medium">
                ₹{Number(transaction.amount).toLocaleString("en-IN")}
              </td>

              <td className="p-4 space-x-2">
                <button className="text-blue-600">Edit</button>

                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
