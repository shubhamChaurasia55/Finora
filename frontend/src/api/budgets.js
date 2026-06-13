import api from "./axios";

export const getBudgets = async (
  month,
  year
) => {
  const response = await api.get(
    `/budgets?month=${month}&year=${year}`
  );

  return response.data.budgets;
};

export const saveBudget = async (
  data
) => {
  const response = await api.post(
    "/budgets",
    data
  );

  return response.data.budget;
};

export const deleteBudget = async (
  id
) => {
  await api.delete(`/budgets/${id}`);
};