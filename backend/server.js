import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import transactionRoutes from "./src/routes/transaction.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";
import budgetRoutes from "./src/routes/budget.routes.js";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

console.log("THIS SERVER FILE IS RUNNING");
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/budgets", budgetRoutes);
console.log("Budget routes loaded");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});


