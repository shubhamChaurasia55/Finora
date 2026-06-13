import express from "express";
import pool from "../config/db.config.js";
import protact from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protact, async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || !amount || !month || !year) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existing = await pool.query(
      `
            SELECT *
            FROM budgets
            WHERE user_id = $1
              AND category = $2
              AND month = $3
              AND year = $4
            `,
      [req.user.id, category, month, year],
    );

    let budget;

    if (existing.rows.length > 0) {
      budget = await pool.query(
        `
                UPDATE budgets
                SET amount = $1,
                    updated_at = NOW()
                WHERE id = $2
                RETURNING *
                `,
        [amount, existing.rows[0].id],
      );
    } else {
      budget = await pool.query(
        `
                INSERT INTO budgets (
                    user_id,
                    category,
                    amount,
                    month,
                    year
                )
                VALUES ($1,$2,$3,$4,$5)
                RETURNING *
                `,
        [req.user.id, category, amount, month, year],
      );
    }

    return res.status(200).json({
      message: "Budget saved successfully",
      budget: budget.rows[0],
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/", protact, async (req, res) => {
  try {
    const month = Number(req.query.month);

    const year = Number(req.query.year);

    if (!month || !year) {
      return res.status(400).json({
        message: "Month and year are required",
      });
    }

    const result = await pool.query(
      `
            SELECT
                b.id,
                b.category,
                b.amount AS budget,
                COALESCE(SUM(t.amount), 0) AS spent
            FROM budgets b
            LEFT JOIN transactions t
                ON t.user_id = b.user_id
                AND t.category = b.category
                AND t.type = 'expense'
                AND EXTRACT(MONTH FROM t.transaction_date) = b.month
                AND EXTRACT(YEAR FROM t.transaction_date) = b.year
            WHERE b.user_id = $1
                AND b.month = $2
                AND b.year = $3
            GROUP BY
                b.id,
                b.category,
                b.amount;
            `,
      [req.user.id, month, year],
    );

    const budgets = result.rows.map((budget) => {
      const spent = Number(budget.spent);

      const total = Number(budget.budget);

      const remaining = total - spent;

      const percentage = total === 0 ? 0 : Math.round((spent / total) * 100);

      return {
        ...budget,

        budget: total,

        spent,

        remaining,

        percentage,
      };
    });

    return res.status(200).json({
      message: "Budgets fetched successfully",

      budgets,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.delete("/:id", protact, async (req, res) => {
  try {
    const result = await pool.query(
      `
                    DELETE FROM budgets
                    WHERE id = $1
                      AND user_id = $2
                    RETURNING *
                    `,
      [req.params.id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
