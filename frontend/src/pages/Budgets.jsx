import { useEffect, useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Target,
  AlertTriangle,
  Wallet,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

import {
  getBudgets,
  saveBudget,
  deleteBudget,
} from "../api/budgets";

import BudgetCard from "../components/budgets/BudgetCard";
import BudgetModal from "../components/budgets/BudgetModal";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const Budgets = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBudgets(month, year);
      setBudgets(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load budgets"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      const payload = {
        category: data.category,
        amount: Number(data.amount),
        month,
        year,
      };
      await saveBudget(payload);
      setShowModal(false);
      fetchBudgets();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to save budget"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this budget?");
    if (!confirmed) return;

    try {
      await deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete budget"
      );
    }
  };

  const goToPrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  // Summary stats
  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPct =
    totalBudget === 0 ? 0 : Math.round((totalSpent / totalBudget) * 100);
  const exceededCount = budgets.filter((b) => b.percentage > 100).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">
            Loading budgets...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-rose-600 text-sm font-semibold max-w-xl mx-auto mt-10 shadow-sm flex items-start gap-3">
        <AlertTriangle className="shrink-0" size={20} />
        <div>
          <p className="font-bold text-base">Budget Error</p>
          <p className="mt-1 text-rose-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        {/* Month Navigator */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevMonth}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <h2 className="text-lg font-bold text-slate-900 min-w-[120px] text-center">
            {monthNames[month - 1]} {year}
          </h2>

          <button
            onClick={goToNextMonth}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="gradient-btn px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all duration-200"
        >
          <Plus size={14} />
          Add Budget
        </button>
      </div>

      {/* Stats Row */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Allocated
                </p>
                <p className="text-xl font-bold text-slate-900">
                  ₹{totalBudget.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Spent
                </p>
                <p className="text-xl font-bold text-slate-900">
                  ₹{totalSpent.toLocaleString("en-IN")}
                  <span
                    className={`text-xs ml-1.5 font-bold ${
                      overallPct > 100 ? "text-rose-500" : "text-slate-400"
                    }`}
                  >
                    {overallPct}%
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  exceededCount > 0
                    ? "bg-rose-50 text-rose-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </p>
                <p
                  className={`text-xl font-bold ${
                    exceededCount > 0 ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {exceededCount > 0
                    ? `${exceededCount} over`
                    : "On track"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overall Progress */}
      {budgets.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-900">Overall Usage</p>
            <p className="text-xs font-semibold text-slate-400">
              ₹{totalRemaining.toLocaleString("en-IN")} remaining
            </p>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                overallPct > 100
                  ? "bg-rose-500"
                  : overallPct > 75
                  ? "bg-amber-500"
                  : "bg-gradient-to-r from-indigo-600 to-blue-500"
              }`}
              style={{ width: `${Math.min(overallPct, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 mb-4">
            <Target size={26} />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No budgets for {monthNames[month - 1]}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1.5 max-w-xs">
            Set a spending limit for a category to start tracking your expenses.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="gradient-btn px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer mt-5"
          >
            Add your first budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <BudgetModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Budgets;