import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Plus,
  Receipt,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown as ExpenseIcon,
  Percent,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboardSummary } from "../api/analytics";
import useAuthStore from "../store/authStore";
import SummaryCard from "../components/dashboard/SummaryCard";
import RecentTransactions from "../components/dashboard/RecentTransactions";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [dashboardData, setDashboardData] = useState({
    summary: {
      income: 0,
      expense: 0,
      savings: 0,
      totaltransactions: 0,
      incomecount: 0,
      expensecount: 0,
      totalTransactions: 0,
      incomeCount: 0,
      expenseCount: 0
    },
    topCategories: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboardSummary();
      setDashboardData({
        summary: data.summary || { income: 0, expense: 0, savings: 0 },
        topCategories: data.topCategories || []
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const summary = dashboardData.summary;
  const incomeVal = Number(summary.income) || 0;
  const expenseVal = Number(summary.expense) || 0;
  const savingsVal = Number(summary.savings) || 0;

  // Use both lowercase/camelcase options for PG result structure safety
  const totalTx = Number(summary.totaltransactions || summary.totalTransactions) || 0;
  const incomeCount = Number(summary.incomecount || summary.incomeCount) || 0;
  const expenseCount = Number(summary.expensecount || summary.expenseCount) || 0;

  const healthScore =
    incomeVal === 0
      ? 0
      : Math.round(
          (savingsVal / incomeVal) * 100
        );

  const score = Math.max(0, Math.min(100, healthScore));

  const insights = [];
  if (expenseVal > incomeVal * 0.8) {
    insights.push({
      type: "warning",
      text: "Your expenses are above 80% of your income. Consider reviewing non-essential spending."
    });
  } else if (savingsVal > incomeVal * 0.3) {
    insights.push({
      type: "success",
      text: "Excellent! You are saving over 30% of your total income this period."
    });
  } else {
    insights.push({
      type: "info",
      text: "Your savings rate looks healthy. Consistent tracking will help you build wealth."
    });
  }

  // Add category specific insight
  if (dashboardData.topCategories.length > 0) {
    const topCat = dashboardData.topCategories[0];
    insights.push({
      type: "info",
      text: `Your largest expense category is "${topCat.category}" at ₹${Number(topCat.total).toLocaleString("en-IN")}.`
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Synchronizing your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-rose-600 text-sm font-semibold max-w-xl mx-auto mt-10 shadow-sm flex items-start gap-3">
        <AlertTriangle className="flex-shrink-0" />
        <div>
          <p className="font-bold text-base">Synchronization Error</p>
          <p className="mt-1 text-rose-500">{error}</p>
        </div>
      </div>
    );
  }

  // Calculate circular stroke details
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Greeting and Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting},{" "}
            <span className="text-gradient font-bold">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Here's a premium view of your cashflow and transaction health.
          </p>
        </div>

        {/* Date / Status Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/40 text-xs font-semibold text-indigo-600 self-start md:self-auto shadow-sm shadow-indigo-100/20">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          Live Database Connected
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Income"
          amount={incomeVal}
          subtitle={`${incomeCount} transaction${incomeCount === 1 ? "" : "s"}`}
          color="bg-emerald-50 text-emerald-600 border border-emerald-100/30"
          icon={<TrendingUp size={22} />}
        />

        <SummaryCard
          title="Total Expenses"
          amount={expenseVal}
          subtitle={`${expenseCount} transaction${expenseCount === 1 ? "" : "s"}`}
          color="bg-rose-50 text-rose-600 border border-rose-100/30"
          icon={<ExpenseIcon size={22} />}
        />

        <SummaryCard
          title="Net Savings"
          amount={savingsVal}
          subtitle="Overall net profit"
          color="bg-blue-50 text-blue-600 border border-blue-100/30"
          icon={<PiggyBank size={22} />}
        />
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Score Panel */}
        <div className="glass-card p-6 flex flex-col justify-between items-center text-center">
          <div className="w-full text-left">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Financial Health</h2>
            <p className="text-[11px] text-slate-500 font-medium">Savings to Income Ratio</p>
          </div>

          {/* Radial Circle Progress */}
          <div className="relative my-6 flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke={score >= 50 ? "#10b981" : score >= 20 ? "#6366f1" : "#f43f5e"}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">{score}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Score</span>
            </div>
          </div>

          <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100/60">
            <p className="text-xs font-semibold text-slate-700">
              {score >= 50
                ? "Excellent financial runway! Keep stacking savings."
                : score >= 20
                ? "Moderate savings. Look for small optimization opportunities."
                : "Tight savings. We advise tracking luxury expense categories."}
            </p>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Quick Actions</h2>
            <p className="text-[11px] text-slate-500 font-medium">Shortcuts to main modules</p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 my-5">
            <button
              onClick={() => navigate("/transactions")}
              className="border border-slate-200/50 bg-white/40 hover:bg-slate-100/60 p-4 rounded-2xl hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group shadow-sm hover:shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
                <ArrowDownRight size={18} />
              </div>
              <p className="text-xs font-semibold text-slate-800">Add Expense</p>
            </button>

            <button
              onClick={() => navigate("/transactions")}
              className="border border-slate-200/50 bg-white/40 hover:bg-slate-100/60 p-4 rounded-2xl hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group shadow-sm hover:shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
                <ArrowUpRight size={18} />
              </div>
              <p className="text-xs font-semibold text-slate-800">Add Income</p>
            </button>

            <button
              onClick={() => navigate("/analytics")}
              className="border border-slate-200/50 bg-white/40 hover:bg-slate-100/60 p-4 rounded-2xl hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group shadow-sm hover:shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
                <BarChart3 size={18} />
              </div>
              <p className="text-xs font-semibold text-slate-800">Analytics</p>
            </button>

            <button
              onClick={() => navigate("/transactions")}
              className="border border-slate-200/50 bg-white/40 hover:bg-slate-100/60 p-4 rounded-2xl hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group shadow-sm hover:shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
                <Receipt size={18} />
              </div>
              <p className="text-xs font-semibold text-slate-800">Ledger</p>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 font-semibold text-center uppercase tracking-widest bg-slate-50 py-2.5 rounded-xl border border-slate-100">
            Total transactions: {totalTx}
          </div>
        </div>

        {/* Top Expense Categories (New dashboard section powered by backend API) */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Top Expenses</h2>
            <p className="text-[11px] text-slate-500 font-medium">Largest outflow areas</p>
          </div>

          <div className="space-y-4 my-5 flex-1 flex flex-col justify-center">
            {dashboardData.topCategories.length === 0 ? (
              <p className="text-xs font-semibold text-slate-400 text-center py-6">No expense categories detected</p>
            ) : (
              dashboardData.topCategories.map((cat, idx) => {
                const percentage = Math.round((Number(cat.total) / (expenseVal || 1)) * 100);
                const colors = ["bg-indigo-600", "bg-violet-500", "bg-purple-400"];
                const bgColors = ["bg-indigo-50 text-indigo-600", "bg-violet-50 text-violet-600", "bg-purple-50 text-purple-600"];

                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-800 flex items-center gap-1.5">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${bgColors[idx % 3]}`}>
                          0{idx + 1}
                        </span>
                        {cat.category}
                      </span>
                      <span className="text-slate-900">₹{Number(cat.total).toLocaleString("en-IN")} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${colors[idx % 3]} rounded-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="text-[10px] text-slate-400 font-medium text-center">
            Calculated from total expense volume
          </div>
        </div>

      </div>

      {/* Recent Activity + Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions Column */}
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>

        {/* AI Financial Insights Column */}
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative blur card glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 blur-2xl rounded-full"></div>

          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>🧠</span> Finora Smart Insights
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Automatic system cashflow feedback</p>
          </div>

          <div className="space-y-4 my-6">
            {insights.map((insight, index) => {
              const bg = insight.type === "warning" ? "bg-rose-50 border-rose-100" : insight.type === "success" ? "bg-emerald-50 border-emerald-100" : "bg-indigo-50/50 border-indigo-100/40";
              const border = insight.type === "warning" ? "border-rose-200/40" : insight.type === "success" ? "border-emerald-200/40" : "border-indigo-100/30";
              const text = insight.type === "warning" ? "text-rose-700" : insight.type === "success" ? "text-emerald-700" : "text-slate-700";
              const Icon = insight.type === "warning" ? AlertTriangle : insight.type === "success" ? CheckCircle : Info;

              return (
                <div
                  key={index}
                  className={`border rounded-2xl p-4 flex gap-3 items-start transition-all duration-300 hover:shadow-sm ${bg} ${border}`}
                >
                  <Icon size={18} className={`mt-0.5 flex-shrink-0 ${insight.type === "warning" ? "text-rose-500" : insight.type === "success" ? "text-emerald-500" : "text-indigo-500"}`} />
                  <p className={`text-xs font-semibold leading-relaxed ${text}`}>
                    {insight.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase text-center bg-slate-50/60 py-2.5 rounded-xl border border-slate-100/50">
            Powered by active database ledger
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;