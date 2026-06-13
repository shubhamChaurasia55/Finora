import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, ShieldAlert } from "lucide-react";

const categories = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Investment",
  "Health",
  "Entertainment",
  "Other",
];

const BudgetModal = ({ onClose, onSave, initialData = null }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "Food",
      amount: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        category: initialData.category,
        amount: initialData.budget,
      });
    } else {
      reset({
        category: "Food",
        amount: "",
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
            {initialData ? "Edit Budget" : "Set Budget"}
          </h2>

          <p className="text-xs text-slate-500 mt-1 font-semibold">
            {initialData
              ? "Update spending limit for this category."
              : "Set a monthly spending limit for a category."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSave)} className="space-y-4.5">
          {/* Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Category
            </label>
            <select
              className="w-full border border-slate-200/60 bg-slate-50/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-sm font-semibold text-slate-700 cursor-pointer"
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

          {/* Amount */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Budget Limit (INR)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full border border-slate-200/60 bg-slate-50/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-sm font-semibold text-slate-800"
              {...register("amount", {
                required: "Budget amount is required",
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
              {initialData ? "Update budget" : "Set budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
