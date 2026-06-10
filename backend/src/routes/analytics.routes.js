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

export default router;