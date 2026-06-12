import api from "./axios";

export const getSummary = async () => {
    const response = await api.get("/analytics/summary");
    return response.data.summary;
};

export const getDashboardSummary = async () => {
  const response = await api.get("/analytics/dashboard");
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get(
    "/analytics/categories"
  );

  return response.data.summary;
};

export const getMonthly = async () => {
  const response = await api.get(
    "/analytics/monthly"
  );

  return response.data.summary;
};