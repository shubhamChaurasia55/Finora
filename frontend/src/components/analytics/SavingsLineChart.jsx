import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import CustomTooltip from "./CustomTooltip";

const SavingsLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-xs font-semibold text-slate-400 py-6">
        No savings growth data available
      </div>
    );
  }

  return (
    <div className="h-64">

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>

          {/* Subtle Grid */}
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

          {/* Tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#CBD5E1",
              strokeWidth: 1.5,
            }}
          />

          {/* Savings Line */}
          <Line
            type="monotone"
            dataKey="savings"
            name="Savings"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{
              r: 4.5,
              fill: "#6366f1",
              stroke: "#FFFFFF",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 7,
              fill: "#6366f1",
              stroke: "#FFFFFF",
              strokeWidth: 2.5,
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center mt-4 text-[11px] font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-indigo-500" />

          <span className="text-slate-500">
            Savings Growth
          </span>
        </div>
      </div>

    </div>
  );
};

export default SavingsLineChart;