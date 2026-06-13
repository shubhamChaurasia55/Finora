import { Trash2 } from "lucide-react";

const BudgetCard = ({ budget, onDelete }) => {
  const exceeded = budget.percentage > 100;
  const pct = Math.min(budget.percentage, 100);

  const barColor = exceeded
    ? "bg-rose-500"
    : budget.percentage > 75
    ? "bg-amber-500"
    : "bg-gradient-to-r from-indigo-600 to-blue-500";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 transition-all duration-200 hover:shadow-md group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
              exceeded
                ? "bg-rose-50 text-rose-600"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            {budget.category.charAt(0)}
          </div>
          <h3 className="font-bold text-sm text-slate-900">
            {budget.category}
          </h3>
        </div>

        <button
          onClick={() => onDelete(budget.id)}
          className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Bottom Stats */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">
          ₹{budget.spent.toLocaleString("en-IN")}
          <span className="text-slate-300"> / </span>
          ₹{budget.budget.toLocaleString("en-IN")}
        </p>

        <p
          className={`text-xs font-bold ${
            exceeded ? "text-rose-500" : "text-slate-400"
          }`}
        >
          {exceeded
            ? `+₹${(budget.spent - budget.budget).toLocaleString("en-IN")}`
            : `₹${budget.remaining.toLocaleString("en-IN")} left`}
        </p>
      </div>
    </div>
  );
};

export default BudgetCard;