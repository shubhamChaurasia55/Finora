import { useForm } from "react-hook-form";

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

const AddTransactionModal = ({ onClose, onSave }) => {
  const {
    register,
    handleSubmit,
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6">Add Transaction</h2>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <input
            type="number"
            placeholder="Amount"
            className="w-full border rounded-lg px-4 py-3"
            {...register("amount", {
              required: "Amount is required",
            })}
          />

          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}

          <select
            className="w-full border rounded-lg px-4 py-3"
            {...register("category")}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="w-full border rounded-lg px-4 py-3"
            {...register("type")}
          >
            <option value="expense">Expense</option>

            <option value="income">Income</option>
          </select>

          <input
            type="date"
            className="w-full border rounded-lg px-4 py-3"
            {...register("transaction_date")}
          />

          <textarea
            placeholder="Description"
            rows="3"
            className="w-full border rounded-lg px-4 py-3"
            {...register("description")}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
