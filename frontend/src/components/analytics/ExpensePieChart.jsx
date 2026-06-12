import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import CustomTooltip from "./CustomTooltip";

const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#d946ef", // Fuchsia
];

const ExpensePieChart = ({ data }) => {
  const chartData = data.slice(0, 5);

  const totalExpense = chartData.reduce(
    (sum, item) => sum + Number(item.total),
    0
  );

  if (chartData.length === 0) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-xs font-semibold text-slate-400 py-6">
        No expense data available this period
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Donut Chart */}
      <div className="h-52 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              content={<CustomTooltip />}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Total</span>
          <span className="text-lg font-extrabold text-slate-900 mt-0.5">
            ₹{totalExpense >= 1000 ? `${(totalExpense / 1000).toFixed(1)}k` : totalExpense}
          </span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="space-y-2.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60">
        {chartData.map((item, index) => {
          const percentage =
            (
              (Number(item.total) /
                (totalExpense || 1)) *
              100
            ).toFixed(0);

          return (
            <div
              key={item.category}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">

                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      COLORS[
                        index %
                          COLORS.length
                      ],
                  }}
                />

                <span className="text-xs font-semibold text-slate-650 truncate">
                  {item.category}
                </span>
              </div>

              <div className="text-right flex-shrink-0 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  ₹
                  {Number(
                    item.total
                  ).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 0,
                    }
                  )}
                </span>

                <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-extrabold text-slate-500">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ExpensePieChart;