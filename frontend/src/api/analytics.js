import api from "./axios";

export const getSummary = async () => {
    const response = await api.get("/analytics/summary");
    return response.data.summary;
};