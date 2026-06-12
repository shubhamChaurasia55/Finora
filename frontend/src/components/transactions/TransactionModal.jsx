import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, ShieldAlert } from "lucide-react";

const categories = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Salary",
  "Investment",
  "Health",
  "Entertainment",
  "Other",
];

const TransactionModal = ({ onClose, onSave, initialData = null }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      category: "Food",
      type: "expense",
      description: "",
      transaction_date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        amount: initialData.amount,
        category: initialData.category,
        type: initialData.type,
        description: initialData.description || "",
        transaction_date: initialData.transaction_date?.split("T")[0] || "",
      });
    } else {
      reset({
        amount: "",
        category: "Food",
        type: "expense",
        description: "",
        transaction_date: new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData, reset]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl border border-slate-100 animate-fade-in-up relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {initialData ? "Edit Transaction" : "Record Transaction"}
          </h2>

          <p className="text-xs text-slate-500 mt-1 font-semibold">
            {initialData
              ? "Modify the transaction ledger record."
              : "Record a new cash flow transaction."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSave)} className="space-y-4.5">
          {/* Amount */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Amount (INR)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full border border-slate-200/60 bg-slate-50/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-sm font-semibold text-slate-800"
              {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 1,
                  message: "Amount must be greater than 0",
                },
              })}
            />

            {errors.amount && (
              <p className="text-rose-500 text-xs mt-1 pl-1 font-medium flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                Category
              </label>
              <select
                className="w-full border border-slate-200/60 bg-slate-50/50 rounded-xl px-3.5 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-xs font-semibold text-slate-700 cursor-pointer"
                {...register("category", {
                  required: "Category is required",
                })}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                Flow Type
              </label>
              <select
                className="w-full border border-slate-200/60 bg-slate-50/50 rounded-xl px-3.5 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-xs font-semibold text-slate-700 cursor-pointer"
                {...register("type", {
                  required: "Type is required",
                })}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Transaction Date
            </label>
            <input
              type="date"
              className="w-full border border-slate-200/60 bg-slate-50/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-sm font-semibold text-slate-700 cursor-pointer"
              {...register("transaction_date", {
                required: "Date is required",
              })}
            />

            {errors.transaction_date && (
              <p className="text-rose-500 text-xs mt-1 pl-1 font-medium flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.transaction_date.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Details (Optional)
            </label>
            <textarea
              rows="3.5"
              placeholder="E.g. Groceries at supermarket"
              className="w-full border border-slate-200/60 bg-slate-50/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-sm resize-none font-medium text-slate-700"
              {...register("description")}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition font-bold text-xs text-slate-500 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="gradient-btn px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-sm hover:shadow"
            >
              {initialData ? "Save changes" : "Record transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
