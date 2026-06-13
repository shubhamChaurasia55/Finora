import express from "express";
import pool from "../config/db.config.js";
import protact from "../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/summary", protact, async (req, res) => {
    try{
        const summary = await pool.query("SELECT SUM(amount) as total, type FROM transactions WHERE user_id = $1 GROUP BY type", [req.user.id]);
        
        const income = summary.rows.filter(
            (item) => item.type === "income"
        )[0]?.total || 0;

        const expense = summary.rows.filter(
            (item) => item.type === "expense"
        )[0]?.total || 0;

        const savings = income - expense;

        return res.status(200).json({message: "Summary fetched successfully", summary: {income, expense, savings}});

    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.get("/categories",protact, async (req, res) => {
    try{
        const result = await pool.query("SELECT category, SUM(amount) as total FROM transactions WHERE user_id = $1 AND type = 'expense' GROUP BY category ORDER BY total DESC", [req.user.id]);

        if(result.rows.length == 0){
            return res.status(201).json({message: "No categories found", summary: []});
        }

        return res.status(200).json({message: "Category summary fetched successfully", summary: result.rows});
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.get("/monthly", protact, async(req, res) => {
    try{
        const result = await pool.query(`
            SELECT

            DATE_TRUNC(
                'month',
                transaction_date
            ) AS month,

            SUM(
                CASE
                    WHEN type='income'
                    THEN amount
                    ELSE 0
                END
            ) AS income,

            SUM(
                CASE
                    WHEN type='expense'
                    THEN amount
                    ELSE 0
                END
            ) AS expense

            FROM transactions

            WHERE user_id = $1

            GROUP BY month

            ORDER BY month
            `,
            [req.user.id]
        );

        const summary = result.rows.map(row => ({
            month: row.month.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    year: "numeric"
                }
            ),
            income: Number(row.income),
            expense: Number(row.expense),
            savings: Number(row.income) - Number(row.expense)
        }));

        return res.status(200).json({message: "Monthly summary fetched successfully", summary});

    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.get("/dashboard",protact, async(req, res) => {
    try{
        const result = await pool.query("SELECT SUM(amount) as total, type FROM transactions WHERE user_id = $1 GROUP BY type", [req.user.id]);
        
        const income = result.rows.filter(
            (item) => item.type === "income"
        )[0]?.total || 0;

        const expense = result.rows.filter(
            (item) => item.type === "expense"
        )[0]?.total || 0;

        const savings = income - expense;

        const topCategorie = await pool.query("SELECT category, SUM(amount) as total FROM transactions WHERE user_id = $1 AND type = 'expense' GROUP BY category ORDER BY total DESC LIMIT 3", [req.user.id]);

        const transactionCount = await pool.query("SELECT COUNT(*) as totalTransactions, SUM(CASE WHEN type = 'income' THEN 1 ELSE 0 END) AS incomeCount, SUM(CASE WHEN type = 'expense' THEN 1 ELSE 0 END) AS expenseCount FROM transactions WHERE user_id = $1", [req.user.id]);

        return res.status(200).json({
            message: "Dashboard summary fetched successfully", 
            summary: {income, expense, savings, ...transactionCount.rows[0]}, 
            topCategories: topCategorie.rows});
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
});

// Monthly-scoped dashboard data 
// GET /analytics/dashboard/monthly?month=6&year=2026
router.get("/dashboard/monthly", protact, async (req, res) => {
    try {
        const month = Number(req.query.month);
        const year = Number(req.query.year);

        if (!month || !year) {
            return res.status(400).json({ message: "Month and year are required" });
        }

        // Monthly income/expense/savings + transaction counts
        const summaryResult = await pool.query(`
            SELECT
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
                COUNT(*) AS total_transactions,
                COALESCE(SUM(CASE WHEN type = 'income' THEN 1 ELSE 0 END), 0) AS income_count,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN 1 ELSE 0 END), 0) AS expense_count
            FROM transactions
            WHERE user_id = $1
              AND EXTRACT(MONTH FROM transaction_date) = $2
              AND EXTRACT(YEAR FROM transaction_date) = $3
        `, [req.user.id, month, year]);

        const row = summaryResult.rows[0];
        const income = Number(row.income);
        const expense = Number(row.expense);
        const savings = income - expense;

        // Top 5 expense categories for this month
        const categoriesResult = await pool.query(`
            SELECT category, SUM(amount) AS total, COUNT(*) AS count
            FROM transactions
            WHERE user_id = $1
              AND type = 'expense'
              AND EXTRACT(MONTH FROM transaction_date) = $2
              AND EXTRACT(YEAR FROM transaction_date) = $3
            GROUP BY category
            ORDER BY total DESC
            LIMIT 5
        `, [req.user.id, month, year]);

        // Previous month income/expense for MoM comparison
        let prevMonth = month - 1;
        let prevYear = year;
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear = year - 1;
        }

        const prevResult = await pool.query(`
            SELECT
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
            FROM transactions
            WHERE user_id = $1
              AND EXTRACT(MONTH FROM transaction_date) = $2
              AND EXTRACT(YEAR FROM transaction_date) = $3
        `, [req.user.id, prevMonth, prevYear]);

        const prevIncome = Number(prevResult.rows[0].income);
        const prevExpense = Number(prevResult.rows[0].expense);

        // Recent 5 transactions for this month
        const recentResult = await pool.query(`
            SELECT id, amount, description, category, type, transaction_date
            FROM transactions
            WHERE user_id = $1
              AND EXTRACT(MONTH FROM transaction_date) = $2
              AND EXTRACT(YEAR FROM transaction_date) = $3
            ORDER BY transaction_date DESC, created_at DESC
            LIMIT 5
        `, [req.user.id, month, year]);

        return res.status(200).json({
            message: "Monthly dashboard data fetched successfully",
            summary: {
                income,
                expense,
                savings,
                totalTransactions: Number(row.total_transactions),
                incomeCount: Number(row.income_count),
                expenseCount: Number(row.expense_count),
            },
            topCategories: categoriesResult.rows,
            previousMonth: {
                income: prevIncome,
                expense: prevExpense,
                savings: prevIncome - prevExpense,
            },
            recentTransactions: recentResult.rows,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Monthly categories breakdown
// GET /analytics/categories/monthly?month=6&year=2026
router.get("/categories/monthly", protact, async (req, res) => {
    try {
        const month = Number(req.query.month);
        const year = Number(req.query.year);

        if (!month || !year) {
            return res.status(400).json({ message: "Month and year are required" });
        }

        const result = await pool.query(`
            SELECT category, SUM(amount) AS total, COUNT(*) AS count
            FROM transactions
            WHERE user_id = $1
              AND type = 'expense'
              AND EXTRACT(MONTH FROM transaction_date) = $2
              AND EXTRACT(YEAR FROM transaction_date) = $3
            GROUP BY category
            ORDER BY total DESC
        `, [req.user.id, month, year]);

        return res.status(200).json({
            message: "Monthly categories fetched successfully",
            summary: result.rows,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;