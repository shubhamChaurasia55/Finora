const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="glass border border-slate-200/50 rounded-2xl shadow-xl px-4 py-3.5 min-w-[150px] animate-fade-in-up">
      {/* Label (Month for Bar/Line charts) */}
      {label && (
        <p className="text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-widest border-b border-slate-200/40 pb-1">
          {label}
        </p>
      )}

      {/* Values */}
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div
            key={entry.dataKey || entry.name}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: entry.color || entry.payload?.fill,
                }}
              />

              <span className="text-xs font-semibold text-slate-500 capitalize">
                {entry.name}
              </span>
            </div>

            <span className="text-xs font-bold text-slate-800">
              ₹
              {Number(entry.value).toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 0,
                }
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomTooltip;