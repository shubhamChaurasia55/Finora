import { useEffect, useState } from "react";

import {
  getTransactions,
  deleteTransaction,
  addTransaction,
} from "../api/transactions";

import TransactionTable from "../components/transactions/TransactionTable";
import AddTransactionModal from "../components/transactions/AddTransactionModal";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const data = await getTransactions();

      setTransactions(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this transaction?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteTransaction(id);

      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleAddTransaction = async (data) => {
    try {
      const transaction = await addTransaction(data);

      setTransactions((prev) => [transaction, ...prev]);

      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add transaction");
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>

          <p className="text-gray-500 mt-1">Manage your income and expenses.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Transaction
        </button>
      </div>

      {/* Transactions Table */}
      <TransactionTable transactions={transactions} onDelete={handleDelete} />

      {/* Add Transaction Modal */}
      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSave={handleAddTransaction}
        />
      )}
    </div>
  );
};

export default Transactions;
