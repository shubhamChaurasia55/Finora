import api from "./axios";

export const getTransactions = async (params = {}) => {
    const response = await api.get("/transactions/all", {
        params,
    });

    return response.data.transactions;
};

export const deleteTransaction = async (id) => {
    await api.delete(`/transactions/delete/${id}`);
};

export const addTransaction = async (data) => {
    const response = await api.post(
        "/transactions/add",
        data
    );

    return response.data.transaction;
};