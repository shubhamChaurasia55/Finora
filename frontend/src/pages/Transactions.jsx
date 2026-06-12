import { useEffect, useState } from "react";
import { Search, Calendar, Tag, Filter, Plus, ArrowUpDown, Receipt } from "lucide-react";
import {
  getTransactions,
  deleteTransaction,
  addTransaction,
  updateTransaction,
} from "../api/transactions";

import TransactionTable from "../components/transactions/TransactionTable";
import TransactionModal from "../components/transactions/TransactionModal";

const categories = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Salary",
  "Investment",
  "Health",
  "Entertainment",
  "Other",
];

const months = [
  { value: "", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  /* Initial page loading */
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  /* Background loading (filters/search) */
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [error, setError] = useState("");

  /* Filters sent to backend */
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    month: "",
    search: "",
  });

  /* Search input state */
  const [searchInput, setSearchInput] = useState("");

  /* Debounce search */
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions(filters);
      setTransactions(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

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

  const handleEdit = async (id, data) => {
    try {
      const updated = await updateTransaction(id, data);
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? updated : transaction,
        ),
      );
      setEditingTransaction(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update transaction");
    }
  };

  /* Full page loading only once */
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Opening financial ledger...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-rose-600 text-sm font-semibold max-w-xl mx-auto mt-10 shadow-sm flex items-start gap-3">
        <Receipt className="flex-shrink-0" />
        <div>
          <p className="font-bold text-base">Ledger Error</p>
          <p className="mt-1 text-rose-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ledger & Transactions</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Record and track itemized income and outflows.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="gradient-btn px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-all duration-300 active:scale-98 hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Record Transaction
        </button>
      </div>

      {/* Filters Frosted Card */}
      <div className="glass-card p-5 border border-slate-200/40 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        
        {/* Category Filter */}
        <div className="relative flex-1 min-w-[150px]">
          <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            className="w-full border border-slate-200/60 bg-white pl-10 pr-4 py-2.5 outline-none rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-xs font-semibold text-slate-700 transition cursor-pointer appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="relative flex-1 min-w-[150px]">
          <Filter size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                type: e.target.value,
              }))
            }
            className="w-full border border-slate-200/60 bg-white pl-10 pr-4 py-2.5 outline-none rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-xs font-semibold text-slate-700 transition cursor-pointer appearance-none"
          >
            <option value="">All Flows</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>

        {/* Month Filter */}
        <div className="relative flex-1 min-w-[150px]">
          <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filters.month}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                month: e.target.value,
              }))
            }
            className="w-full border border-slate-200/60 bg-white pl-10 pr-4 py-2.5 outline-none rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-xs font-semibold text-slate-700 transition cursor-pointer appearance-none"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-[1.5] min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search details or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-slate-200/60 bg-white pl-10 pr-4 py-2.5 outline-none rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-xs font-semibold text-slate-700 transition"
          />
        </div>
      </div>

      {/* Sync Status Banner */}
      {loading && (
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 px-1.5 animate-pulse">
          <ArrowUpDown size={14} />
          Syncing database ledger records...
        </div>
      )}

      {/* Transactions Table List */}
      <TransactionTable
        transactions={transactions}
        onDelete={handleDelete}
        onEdit={setEditingTransaction}
      />

      {/* Add Transaction Dialog */}
      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSave={handleAddTransaction}
        />
      )}

      {/* Edit Transaction Dialog */}
      {editingTransaction && (
        <TransactionModal
          initialData={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={(data) => handleEdit(editingTransaction.id, data)}
        />
      )}
    </div>
  );
};

export default Transactions;
