const SummaryCard = ({ title, amount }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500">
                {title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
                ₹{Number(amount).toLocaleString("en-IN")}
            </h2>
        </div>
    );
};

export default SummaryCard;