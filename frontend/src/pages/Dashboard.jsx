import { useEffect, useState } from "react";

import { getSummary } from "../api/analytics";
import useAuthStore from "../store/authStore";

import SummaryCard from "../components/dashboard/SummaryCard";

const Dashboard = () => {
    const user = useAuthStore((state) => state.user);

    const [summary, setSummary] = useState({
        income: 0,
        expense: 0,
        savings: 0,
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            setLoading(true);

            const data = await getSummary();

            setSummary(data);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Welcome */}
            <div>
                <h1 className="text-3xl font-bold">
                    Welcome back, {user?.name} 👋
                </h1>

                <p className="text-gray-500 mt-2">
                    Here's an overview of your finances.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <SummaryCard
                    title="Income"
                    amount={summary.income}
                />

                <SummaryCard
                    title="Expense"
                    amount={summary.expense}
                />

                <SummaryCard
                    title="Savings"
                    amount={summary.savings}
                />

            </div>

        </div>
    );
};

export default Dashboard;