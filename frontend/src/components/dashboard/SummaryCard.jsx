const SummaryCard = ({
  title,
  amount,
  subtitle,
  icon,
  color,
}) => {
  return (
    <div
      className="
        glass-card
        p-6
        hover:-translate-y-1
        hover:shadow-xl
        transition-all
        duration-300
      "
    >
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            ₹
            {Number(amount).toLocaleString(
              "en-IN"
            )}
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            {subtitle}
          </p>
        </div>

        <div
          className={`
            w-12 h-12 rounded-2xl
            flex items-center justify-center
            ${color}
          `}
        >
          {icon}
        </div>

      </div>
    </div>
  );
};

export default SummaryCard;