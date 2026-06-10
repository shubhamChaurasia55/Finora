import express from "express";
import protact from "../middlewares/auth.middleware.js";
import pool from "../config/db.config.js";


const router = express.Router();

router.post("/add", protact, async (req, res) => {
    try{
        const {amount, description, category, type, transaction_date} = req.body;
        
        if(!amount || !category || !type || !transaction_date){
            return res.status(400).json({message: "All fields are required"});
        }

        const newTransaction = await pool.query(`INSERT INTO transactions (amount, description, category, type, transaction_date, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [amount, description, category, type, transaction_date, req.user.id]);

        return res.status(201).json({message: "Transaction created successfully", transaction: newTransaction.rows[0]});
        
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.get("/all", protact, async (req, res) => {
    try{
        const {category, type, month} = req.query;

        let query = `SELECT * FROM transactions WHERE user_id = $1`;
        let values = [req.user.id];
        
        if(category){
            values.push(category);
            query += ` AND category = $${values.length}`;
        }

        if(type) {
            values.push(type);
            query += ` AND type = $${values.length}`;
        }

        if(month) {
            values.push(month);
            query += ` AND EXTRACT(MONTH FROM transaction_date) = $${values.length}`;
        }

        const transactions = await pool.query(query, values);

        return res.status(200).json({message: "Transactions fetched successfully", transactions: transactions.rows});

    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.get("/summary", protact, async (req, res) => {
    try{
        const summary = await pool.query("SELECT SUM(amount) as total, type FROM transactions WHERE user_id = $1 GROUP BY type", [req.user.id]);
        
        const totalIncome = summary.rows.find(item => item.type === "income")?.total || 0;
        const totalExpense = summary.rows.find(item => item.type === "expense")?.total || 0;

        return res.status(200).json({message: "Summary fetched successfully", summary: {income: totalIncome, expense: totalExpense}});        
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.get("/:id", protact, async (req, res) => {
    try{
        const id = req.params.id;

        const transaction = await pool.query("SELECT * FROM transactions WHERE id = $1 AND user_id = $2", [id, req.user.id]);

        if(transaction.rows.length == 0){
            return res.status(404).json({message: "Transaction not found"});
        }

        return res.status(200).json({message: "Transaction fetched successfully", transaction: transaction.rows[0]});

    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.patch("/update/:id", protact, async (req, res) => {
    try{
        const id = req.params.id;
        const {amount, description, category, type, transaction_date} = req.body;

        const updatedTransaction = await pool.query(`UPDATE transactions SET amount = $1, description = $2, category = $3, type = $4, transaction_date = $5 WHERE id = $6 AND user_id = $7 RETURNING *`, [amount, description, category, type, transaction_date, id, req.user.id]);

        return res.status(200).json({message: "Transaction updated successfully", transaction: updatedTransaction.rows[0]});
        
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.delete("/delete/:id", protact, async (req, res) => {
    try{
        const id = req.params.id;

        const deletedTransaction = await pool.query("DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *", [id, req.user.id]);

        return res.status(200).json({message: "Transaction deleted successfully", transaction: deletedTransaction.rows[0]});
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
});



export default router;