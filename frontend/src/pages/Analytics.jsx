import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Download,
  Bot,
  Calendar,
  Award,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { getCategories, getMonthly } from "../api/analytics";

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
      const [categoryData, monthlyData] = await Promise.all([
        getCategories(),
        getMonthly(),
      ]);

      setCategories(
        categoryData.map((item) => ({
          category: item.category,
          total: Number(item.total) || 0,
        })),
      );

      setMonthly(
        monthlyData.map((item) => ({
          month: item.month,
          income: Number(item.income) || 0,
          expense: Number(item.expense) || 0,
          savings: Number(item.savings) || 0,
        })),
      );

      setError("");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = monthly.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = monthly.reduce((sum, item) => sum + item.expense, 0);
  const totalSavings = monthly.reduce((sum, item) => sum + item.savings, 0);
  const savingsRate = totalIncome === 0 ? 0 : Math.round((totalSavings / totalIncome) * 100);
  const expenseRate = totalIncome === 0 ? 0 : Math.round((totalExpense / totalIncome) * 100);

  let momExpenseChange = null;
  let momIncomeChange = null;
  if (monthly.length >= 2) {
    const last = monthly[monthly.length - 1];
    const prev = monthly[monthly.length - 2];
    if (prev.expense > 0) momExpenseChange = Math.round(((last.expense - prev.expense) / prev.expense) * 100);
    if (prev.income > 0) momIncomeChange = Math.round(((last.income - prev.income) / prev.income) * 100);
  }

  let bestMonth = null;
  let worstMonth = null;
  if (monthly.length > 0) {
    bestMonth = monthly.reduce((best, m) => (m.savings > best.savings ? m : best));
    worstMonth = monthly.reduce((worst, m) => (m.savings < worst.savings ? m : worst));
  }

  const avgMonthlyExpense = monthly.length === 0 ? 0 : Math.round(totalExpense / monthly.length);
  const projectedAnnualSavings = monthly.length === 0 ? 0 : Math.round((totalSavings / monthly.length) * 12);

  const topCategory = categories.length > 0 ? categories.reduce((top, c) => (c.total > top.total ? c : top)) : null;
  const topCategoryPct = topCategory ? Math.round((topCategory.total / (totalExpense || 1)) * 100) : 0;

  let runningIncome = 0;
  let runningExpense = 0;
  let runningSavings = 0;

  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-rose-600 text-sm font-semibold max-w-xl mx-auto mt-10 shadow-sm flex items-start gap-3">
        <BarChart3 className="shrink-0" />
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Overall performance & yearly trends</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100/40 text-[11px] font-bold text-violet-600">
            <Calendar size={12} />
            {currentYear} · Year to Date
          </div>
          <button disabled className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-400 cursor-not-allowed" title="Export coming soon">
            <Download size={11} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp size={17} /></div>
            {momIncomeChange !== null && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${momIncomeChange >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {momIncomeChange >= 0 ? <ArrowUpRight size={9} className="inline" /> : <ArrowDownRight size={9} className="inline" />} {Math.abs(momIncomeChange)}%
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{totalIncome.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Total Income · Overall</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><TrendingDown size={17} /></div>
            {momExpenseChange !== null && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${momExpenseChange <= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {momExpenseChange > 0 ? <ArrowUpRight size={9} className="inline" /> : <ArrowDownRight size={9} className="inline" />} {Math.abs(momExpenseChange)}%
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{totalExpense.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Total Expenses · Overall</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><PiggyBank size={17} /></div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${savingsRate >= 20 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>{savingsRate}% saved</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{totalSavings.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Net Savings · Overall</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center"><Percent size={17} /></div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500">{expenseRate}% of income</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{avgMonthlyExpense.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Avg Monthly Expense</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Income vs Expenses</h2>
            <p className="text-[11px] text-slate-400 font-medium">Monthly comparison across all time</p>
          </div>
          <MonthlyBarChart data={monthly} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col">
          <div className="mb-3">
            <h2 className="text-sm font-bold text-slate-900">Spending Breakdown</h2>
            <p className="text-[11px] text-slate-400 font-medium">All-time by category</p>
          </div>
          <div className="flex-1"><ExpensePieChart data={categories} /></div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Savings Trend</h2>
            <p className="text-[11px] text-slate-400 font-medium">Net savings over time</p>
          </div>
          <SavingsLineChart data={monthly} />
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Highlights</h2>
            <p className="text-[11px] text-slate-400 font-medium">Key performance indicators</p>
          </div>

          <div className="space-y-3 flex-1">
            {bestMonth && (
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100/50">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Award size={12} className="text-emerald-600" />
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Best Month</p>
                </div>
                <p className="text-base font-bold text-slate-900">{bestMonth.month}</p>
                <p className="text-[11px] text-slate-500 font-medium">Saved ₹{bestMonth.savings.toLocaleString("en-IN")}</p>
              </div>
            )}

            {worstMonth && worstMonth.month !== bestMonth?.month && (
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100/50">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <AlertTriangle size={12} className="text-rose-600" />
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Toughest Month</p>
                </div>
                <p className="text-base font-bold text-slate-900">{worstMonth.month}</p>
                <p className="text-[11px] text-slate-500 font-medium">Saved ₹{worstMonth.savings.toLocaleString("en-IN")}</p>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-violet-50/60 border border-violet-100/50">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Activity size={12} className="text-violet-600" />
                <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Projected Annual</p>
              </div>
              <p className="text-base font-bold text-slate-900">₹{projectedAnnualSavings.toLocaleString("en-IN")}</p>
              <p className="text-[11px] text-slate-500 font-medium">{monthly.length} month{monthly.length !== 1 ? "s" : ""} of data</p>
            </div>

            {topCategory && (
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100/50">
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Top Category</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{topCategory.category}</p>
                <p className="text-[11px] text-slate-500 font-medium">₹{topCategory.total.toLocaleString("en-IN")} ({topCategoryPct}%)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Month-by-Month Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Month-by-Month Breakdown</h2>
            <p className="text-[11px] text-slate-400 font-medium">Detailed comparison with running totals</p>
          </div>
          <button disabled className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-400 cursor-not-allowed" title="Export coming soon">
            <Download size={10} />
            Export CSV
          </button>
        </div>

        {monthly.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium text-center py-8">No data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left font-bold text-slate-500 uppercase tracking-wider py-2.5 px-3">Month</th>
                  <th className="text-right font-bold text-slate-500 uppercase tracking-wider py-2.5 px-3">Income</th>
                  <th className="text-right font-bold text-slate-500 uppercase tracking-wider py-2.5 px-3">Expense</th>
                  <th className="text-right font-bold text-slate-500 uppercase tracking-wider py-2.5 px-3">Savings</th>
                  <th className="text-right font-bold text-slate-500 uppercase tracking-wider py-2.5 px-3 hidden sm:table-cell">Running</th>
                  <th className="text-right font-bold text-slate-500 uppercase tracking-wider py-2.5 px-3 hidden md:table-cell">Rate</th>
                </tr>
              </thead>
              <tbody>
                {monthly.map((m, idx) => {
                  runningIncome += m.income;
                  runningExpense += m.expense;
                  runningSavings += m.savings;
                  const rate = m.income === 0 ? 0 : Math.round((m.savings / m.income) * 100);
                  return (
                    <tr key={m.month} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx === monthly.length - 1 ? "bg-indigo-50/20" : ""}`}>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{m.month}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-semibold">₹{m.income.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-semibold">₹{m.expense.toLocaleString("en-IN")}</td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${m.savings >= 0 ? "text-blue-600" : "text-rose-600"}`}>₹{m.savings.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 px-3 text-right text-slate-500 font-medium hidden sm:table-cell">₹{runningSavings.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 px-3 text-right hidden md:table-cell">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${rate >= 20 ? "bg-emerald-50 text-emerald-600" : rate >= 0 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}>{rate}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200">
                  <td className="py-2.5 px-3 font-extrabold text-slate-900">Total</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700">₹{totalIncome.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-rose-700">₹{totalExpense.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-blue-700">₹{totalSavings.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 hidden sm:table-cell"></td>
                  <td className="py-2.5 px-3 text-right hidden md:table-cell">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${savingsRate >= 20 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>{savingsRate}% avg</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* AI Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-500/15 shrink-0">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                AI Financial Summary
                <span className="text-[8px] font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100/40">Soon</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Yearly trend analysis & recommendations</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {["Yearly Summary", "Trends", "Recommendations"].map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded bg-indigo-50 text-[9px] font-bold uppercase tracking-wider text-indigo-500 border border-indigo-100/40">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
