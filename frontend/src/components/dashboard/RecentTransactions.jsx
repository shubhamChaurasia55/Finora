import { useEffect, useState } from "react";
import { getTransactions } from "../../api/transactions";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity,
  ShoppingBag,
  Briefcase,
  Utensils,
  Plane,
  FileText,
  TrendingUp,
  HeartPulse,
  Film,
  HelpCircle 
} from "lucide-react";

// Map categories to modern icons
const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "food":
      return <Utensils size={18} />;
    case "travel":
      return <Plane size={18} />;
    case "bills":
      return <FileText size={18} />;
    case "shopping":
      return <ShoppingBag size={18} />;
    case "salary":
      return <Briefcase size={18} />;
    case "investment":
      return <TrendingUp size={18} />;
    case "health":
      return <HeartPulse size={18} />;
    case "entertainment":
      return <Film size={18} />;
    default:
      return <HelpCircle size={18} />;
  }
};

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to load recent transactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-6 h-full flex flex-col items-center justify-center min-h-[300px]">
        <Activity className="animate-spin text-indigo-500 mb-4" size={32} />
        <p className="text-slate-500 font-semibold text-sm">Loading recent activity...</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Activity</h2>
          <p className="text-xs text-slate-500 font-medium">Your latest transactions</p>
        </div>
        <button
          onClick={() => navigate("/transactions")}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group transition cursor-pointer"
        >
          View all 
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm py-10">
          <Activity size={36} className="text-slate-300 mb-3" />
          No recent transactions found.
        </div>
      ) : (
        <div className="space-y-3.5 flex-1">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3.5 hover:bg-slate-50/80 border border-transparent hover:border-slate-200/40 rounded-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tx.type === "income"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100/30"
                      : "bg-rose-50 text-rose-600 border border-rose-100/30"
                  }`}
                >
                  {getCategoryIcon(tx.category)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate leading-tight">{tx.description || tx.category}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{tx.category}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={`font-bold text-sm leading-tight ${
                    tx.type === "income" ? "text-emerald-600" : "text-slate-900"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">
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
  );
};

export default RecentTransactions;
