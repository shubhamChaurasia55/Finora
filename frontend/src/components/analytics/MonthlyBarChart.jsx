import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import CustomTooltip from "./CustomTooltip";

const MonthlyBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-xs font-semibold text-slate-400 py-6">
        No monthly analytics ledger data available
      </div>
    );
  }

  return (
    <div className="h-64">

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barGap={6}
          barCategoryGap="28%"
        >
          {/* Subtle horizontal grid */}
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#E2E8F0"
          />

          {/* X Axis */}
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 10,
              fontWeight: 600,
              fill: "#94A3B8",
            }}
          />

          {/* Y Axis */}
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 10,
              fontWeight: 650,
              fill: "#94A3B8",
            }}
            tickFormatter={(value) =>
              `₹${Number(value) / 1000}k`
            }
          />

          {/* Custom Tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: "rgba(99, 102, 241, 0.04)",
              radius: 6
            }}
          />

          {/* Income */}
          <Bar
            dataKey="income"
            name="Income"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />

          {/* Expense */}
          <Bar
            dataKey="expense"
            name="Expense"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-[11px] font-bold uppercase tracking-wider">

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500" />

          <span className="text-slate-500">
            Income
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-rose-500" />

          <span className="text-slate-500">
            Expense
          </span>
        </div>

      </div>
    </div>
  );
};

export default MonthlyBarChart;