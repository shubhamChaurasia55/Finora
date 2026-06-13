import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Target,
  ArrowRight,
  ShieldCheck,
  Clock,
  CalendarDays,
  Download,
  Bot,
  MessageSquare,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { getMonthlyDashboard, getMonthly } from "../api/analytics";
import { getBudgets } from "../api/budgets";
import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const currentMonthName = today.toLocaleString("en-IN", { month: "long" });

  const [monthlyDash, setMonthlyDash] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashData, trendData, budgetData] = await Promise.all([
        getMonthlyDashboard(currentMonth, currentYear),
        getMonthly().catch(() => []),
        getBudgets(currentMonth, currentYear).catch(() => []),
      ]);

      setMonthlyDash(dashData);
      setMonthlyTrend(
        (trendData || []).map((item) => ({
          month: item.month,
          income: Number(item.income) || 0,
          expense: Number(item.expense) || 0,
          savings: Number(item.savings) || 0,
        })),
      );
      setBudgets(budgetData || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const hour = today.getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // Monthly data from the new endpoint
  const summary = monthlyDash?.summary || {};
  const incomeVal = Number(summary.income) || 0;
  const expenseVal = Number(summary.expense) || 0;
  const savingsVal = Number(summary.savings) || 0;
  const totalTx = Number(summary.totalTransactions) || 0;
  const incomeCount = Number(summary.incomeCount) || 0;
  const expenseCount = Number(summary.expenseCount) || 0;

  const topCategories = monthlyDash?.topCategories || [];
  const previousMonth = monthlyDash?.previousMonth || {};
  const recentTransactions = monthlyDash?.recentTransactions || [];

  // MoM changes (computed from real backend data)
  const prevExpense = Number(previousMonth.expense) || 0;
  const prevIncome = Number(previousMonth.income) || 0;
  const momExpenseChange =
    prevExpense > 0
      ? Math.round(((expenseVal - prevExpense) / prevExpense) * 100)
      : null;
  const momIncomeChange =
    prevIncome > 0
      ? Math.round(((incomeVal - prevIncome) / prevIncome) * 100)
      : null;

  // Derived metrics
  const expenseRatio =
    incomeVal === 0 ? 0 : Math.round((expenseVal / incomeVal) * 100);
  const savingsRate =
    incomeVal === 0 ? 0 : Math.round((savingsVal / incomeVal) * 100);
  const dailyAvgExpense = Math.round(expenseVal / 30);

  // Budget health
  const budgetsExceeded = budgets.filter((b) => b.percentage > 100).length;
  const budgetsOnTrack = budgets.filter((b) => b.percentage <= 75).length;
  const budgetsWarning = budgets.filter(
    (b) => b.percentage > 75 && b.percentage <= 100,
  ).length;
  const totalBudgetLimit = budgets.reduce((s, b) => s + b.budget, 0);
  const totalBudgetSpent = budgets.reduce((s, b) => s + b.spent, 0);

  // Insights (all based on real monthly data)
  const insights = [];

  if (expenseRatio > 90) {
    insights.push({
      type: "warning",
      text: `Spending ${expenseRatio}% of income this month. Consider cutting non-essentials.`,
      icon: AlertTriangle,
    });
  } else if (expenseRatio > 70) {
    insights.push({
      type: "warning",
      text: `Expense ratio at ${expenseRatio}% this month. Review discretionary spending.`,
      icon: AlertTriangle,
    });
  } else if (savingsRate > 30) {
    insights.push({
      type: "success",
      text: `Saving ${savingsRate}% of income — above the 20% benchmark.`,
      icon: CheckCircle,
    });
  } else if (incomeVal > 0) {
    insights.push({
      type: "info",
      text: `Savings rate at ${savingsRate}% this month. Keep tracking consistently.`,
      icon: Info,
    });
  }

  if (budgetsExceeded > 0) {
    insights.push({
      type: "warning",
      text: `${budgetsExceeded} budget${budgetsExceeded > 1 ? "s" : ""} exceeded. Check ${budgets.find((b) => b.percentage > 100)?.category || "spending"}.`,
      icon: AlertTriangle,
    });
  } else if (budgets.length > 0) {
    insights.push({
      type: "success",
      text: `All ${budgets.length} budgets on track. ₹${totalBudgetSpent.toLocaleString("en-IN")} of ₹${totalBudgetLimit.toLocaleString("en-IN")} used.`,
      icon: ShieldCheck,
    });
  }

  if (momExpenseChange !== null) {
    if (momExpenseChange > 15) {
      insights.push({
        type: "warning",
        text: `Spending up ${momExpenseChange}% vs last month.`,
        icon: TrendingUp,
      });
    } else if (momExpenseChange < -10) {
      insights.push({
        type: "success",
        text: `Spending down ${Math.abs(momExpenseChange)}% vs last month.`,
        icon: TrendingDown,
      });
    }
  }

  if (topCategories.length > 0) {
    const topCat = topCategories[0];
    const topPct = Math.round((Number(topCat.total) / (expenseVal || 1)) * 100);
    insights.push({
      type: "info",
      text: `Top expense: ${topCat.category} at ₹${Number(topCat.total).toLocaleString("en-IN")} (${topPct}%).`,
      icon: Info,
    });
  }

  // Chart tooltip
  const ChartTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white rounded-xl px-3 py-2 shadow-lg border border-slate-100 text-xs">
          <p className="font-bold text-slate-700 mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="font-semibold" style={{ color: entry.color }}>
              {entry.name}: ₹{Number(entry.value).toLocaleString("en-IN")}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-rose-600 text-sm font-semibold max-w-xl mx-auto mt-10 shadow-sm flex items-start gap-3">
        <AlertTriangle className="shrink-0" />
        <div>
          <p className="font-bold text-base">Error</p>
          <p className="mt-1 text-rose-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {greeting},{" "}
            <span className="text-gradient">{user?.name?.split(" ")[0]}</span>{" "}
            👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {currentMonthName} {currentYear} · Monthly overview
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/40 text-[11px] font-bold text-indigo-600">
            <CalendarDays size={12} />
            {currentMonthName.slice(0, 3)} {currentYear}
          </div>
          <button
            disabled
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-400 cursor-not-allowed"
            title="Export coming soon"
          >
            <Download size={11} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={17} />
            </div>
            {momIncomeChange !== null && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${momIncomeChange >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
              >
                {momIncomeChange >= 0 ? (
                  <ArrowUpRight size={9} className="inline" />
                ) : (
                  <ArrowDownRight size={9} className="inline" />
                )}{" "}
                {Math.abs(momIncomeChange)}%
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ₹{incomeVal.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Income · {incomeCount} txn{incomeCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown size={17} />
            </div>
            {momExpenseChange !== null && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${momExpenseChange <= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
              >
                {momExpenseChange > 0 ? (
                  <ArrowUpRight size={9} className="inline" />
                ) : (
                  <ArrowDownRight size={9} className="inline" />
                )}{" "}
                {Math.abs(momExpenseChange)}%
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ₹{expenseVal.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Expenses · {expenseCount} txn{expenseCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PiggyBank size={17} />
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${savingsRate >= 20 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
            >
              {savingsRate}% saved
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${savingsVal >= 0 ? "text-slate-900" : "text-rose-600"}`}
          >
            ₹{savingsVal.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Net Savings
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={17} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500">
              {expenseRatio}% of income
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ₹{dailyAvgExpense.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Daily Avg · {totalTx} total txns
          </p>
        </div>
      </div>

      {/* Cashflow Chart + Budget Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cashflow trend chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Monthly Cashflow
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Income vs Expense trend
              </p>
            </div>
            {momExpenseChange !== null && (
              <div
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${momExpenseChange > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}
              >
                {momExpenseChange > 0 ? (
                  <ArrowUpRight size={10} />
                ) : (
                  <ArrowDownRight size={10} />
                )}
                {Math.abs(momExpenseChange)}% MoM
              </div>
            )}
          </div>

          {monthlyTrend.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="dInc" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dExp" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#f43f5e"
                        stopOpacity={0.12}
                      />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#94A3B8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#94A3B8" }}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#dInc)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Expense"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#dExp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center text-xs text-slate-400 font-medium py-16">
              No trend data yet
            </div>
          )}
          <div className="flex justify-center gap-5 mt-2 text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-emerald-500" />
              <span className="text-slate-400">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-rose-500" />
              <span className="text-slate-400">Expense</span>
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Budgets</h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {currentMonthName} status
              </p>
            </div>
            <button
              onClick={() => navigate("/budgets")}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group transition cursor-pointer"
            >
              View{" "}
              <ArrowRight
                size={12}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </div>

          {budgets.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-400 mb-2">
                <Target size={18} />
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                No budgets set
              </p>
              <button
                onClick={() => navigate("/budgets")}
                className="mt-2 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
              >
                Set budget →
              </button>
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {budgets.slice(0, 4).map((b) => {
                const exceeded = b.percentage > 100;
                const pct = Math.min(b.percentage, 100);
                return (
                  <div key={b.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-800">
                        {b.category}
                      </span>
                      <span
                        className={`font-bold ${exceeded ? "text-rose-500" : "text-slate-500"}`}
                      >
                        ₹{b.spent.toLocaleString("en-IN")} / ₹
                        {b.budget.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${exceeded ? "bg-rose-500" : b.percentage > 75 ? "bg-amber-500" : "bg-gradient-to-r from-blue-600 to-indigo-600"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {budgets.length > 0 && (
            <div className="flex gap-2 mt-3 text-[9px] font-bold uppercase tracking-wider">
              <div className="flex-1 text-center py-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                {budgetsOnTrack} on track
              </div>
              {budgetsWarning > 0 && (
                <div className="flex-1 text-center py-1.5 rounded-lg bg-amber-50 text-amber-600">
                  {budgetsWarning} warning
                </div>
              )}
              {budgetsExceeded > 0 && (
                <div className="flex-1 text-center py-1.5 rounded-lg bg-rose-50 text-rose-600">
                  {budgetsExceeded} exceeded
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Insights + Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Insights */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-1">
            Monthly Insights
          </h2>
          <p className="text-[11px] text-slate-400 font-medium mb-4">
            Smart analysis for {currentMonthName}
          </p>

          {insights.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium py-6 text-center">
              Add transactions to see insights
            </p>
          ) : (
            <div className="space-y-2.5">
              {insights.map((insight, i) => {
                const bg =
                  insight.type === "warning"
                    ? "bg-rose-50 border-rose-100"
                    : insight.type === "success"
                      ? "bg-emerald-50 border-emerald-100"
                      : "bg-slate-50 border-slate-100";
                const text =
                  insight.type === "warning"
                    ? "text-rose-700"
                    : insight.type === "success"
                      ? "text-emerald-700"
                      : "text-slate-700";
                const iconColor =
                  insight.type === "warning"
                    ? "text-rose-500"
                    : insight.type === "success"
                      ? "text-emerald-500"
                      : "text-slate-400";
                const Icon = insight.icon;
                return (
                  <div
                    key={i}
                    className={`border rounded-xl p-3 flex gap-2.5 items-start ${bg}`}
                  >
                    <Icon
                      size={14}
                      className={`mt-0.5 shrink-0 ${iconColor}`}
                    />
                    <p
                      className={`text-[11px] font-semibold leading-relaxed ${text}`}
                    >
                      {insight.text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-1">
            Top Categories
          </h2>
          <p className="text-[11px] text-slate-400 font-medium mb-4">
            Where your money went in {currentMonthName}
          </p>

          {topCategories.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium py-6 text-center">
              No expenses this month
            </p>
          ) : (
            <div className="space-y-3">
              {topCategories.slice(0, 5).map((cat, idx) => {
                const percentage = Math.round(
                  (Number(cat.total) / (expenseVal || 1)) * 100,
                );
                const barColors = [
                  "bg-indigo-600",
                  "bg-violet-500",
                  "bg-blue-500",
                  "bg-teal-500",
                  "bg-amber-500",
                ];
                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-800">{cat.category}</span>
                      <span className="text-slate-600">
                        ₹{Number(cat.total).toLocaleString("en-IN")} (
                        {percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColors[idx % 5]} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Recent Activity
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              {currentMonthName}'s latest transactions
            </p>
          </div>
          <button
            onClick={() => navigate("/transactions")}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group transition cursor-pointer"
          >
            View all{" "}
            <ArrowRight
              size={12}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium py-6 text-center">
            No transactions this month
          </p>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                  >
                    {tx.type === "income" ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[12px] text-slate-900 truncate">
                      {tx.description || tx.category}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {tx.category}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`font-bold text-[12px] ${tx.type === "income" ? "text-emerald-600" : "text-slate-900"}`}
                  >
                    {tx.type === "income" ? "+" : "-"}₹
                    {Number(tx.amount).toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(tx.transaction_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Assistant Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-500/15 shrink-0">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Finora AI
                <span className="text-[8px] font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100/40">
                  Soon
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Smart spending predictions & savings strategies
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 flex-1 sm:w-52">
              <MessageSquare size={12} />
              <span className="text-[11px] font-medium truncate">
                Ask about your finances...
              </span>
            </div>
            <button
              disabled
              className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white/50 cursor-not-allowed"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
