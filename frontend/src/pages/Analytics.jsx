import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, PiggyBank, BarChart3, HelpCircle } from "lucide-react";
import {
  getCategories,
  getMonthly,
} from "../api/analytics";

import ExpensePieChart from "../components/analytics/ExpensePieChart";
import MonthlyBarChart from "../components/analytics/MonthlyBarChart";
import SavingsLineChart from "../components/analytics/SavingsLineChart";

const Analytics = () => {
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const [categoryData, monthlyData] =
        await Promise.all([
          getCategories(),
          getMonthly(),
        ]);

      setCategories(
        categoryData.map((item) => ({
          category: item.category,
          total: Number(item.total) || 0,
        }))
      );

      setMonthly(
        monthlyData.map((item) => ({
          month: item.month,
          income: Number(item.income) || 0,
          expense: Number(item.expense) || 0,
          savings: Number(item.savings) || 0,
        }))
      );

      setError("");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = monthly.reduce(
    (sum, item) => sum + item.income,
    0
  );

  const totalExpense = monthly.reduce(
    (sum, item) => sum + item.expense,
    0
  );

  const totalSavings = monthly.reduce(
    (sum, item) => sum + item.savings,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Processing financial analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-rose-600 text-sm font-semibold max-w-xl mx-auto mt-10 shadow-sm flex items-start gap-3">
        <BarChart3 className="shrink-0" />
        <div>
          <p className="font-bold text-base">Analytics Error</p>
          <p className="mt-1 text-rose-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Cashflow Analytics
            </h1>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
              Intelligence
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Visualize income distributions, expense breakdowns, and monthly net savings growth.
          </p>
        </div>
      </div>

      {/* KPI Cards frosted grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Income */}
        <div className="glass-card p-6 flex items-start justify-between border border-slate-200/40">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Inflow Volume
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              ₹{totalIncome.toLocaleString("en-IN")}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Combined earned funds
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="glass-card p-6 flex items-start justify-between border border-slate-200/40">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Outflow Volume
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              ₹{totalExpense.toLocaleString("en-IN")}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Combined spent funds
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown size={20} />
          </div>
        </div>

        {/* Total Savings */}
        <div className="glass-card p-6 flex items-start justify-between border border-slate-200/40">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Net Savings Volume
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              ₹{totalSavings.toLocaleString("en-IN")}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Net profit retention
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PiggyBank size={20} />
          </div>
        </div>

      </div>

      {/* Main Charts grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Monthly Overview Bar Chart */}
        <div className="xl:col-span-2 glass-card p-6 border border-slate-200/40">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Monthly cash flow comparison
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Visual ledger comparison between incoming and outgoing balances.
            </p>
          </div>

          <MonthlyBarChart
            data={monthly}
          />
        </div>

        {/* Spending Breakdown Donut Chart */}
        <div className="glass-card p-6 flex flex-col justify-between border border-slate-200/40">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Category Distribution
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Top category expenses breakdown.
            </p>
          </div>

          <ExpensePieChart
            data={categories}
          />
        </div>

      </div>

      {/* Savings Growth Line Chart */}
      <div className="glass-card p-6 border border-slate-200/40">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Savings growth trend
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Linear progression chart showing net savings growth trajectory.
          </p>
        </div>

        <SavingsLineChart
          data={monthly}
        />
      </div>

    </div>
  );
};

export default Analytics;