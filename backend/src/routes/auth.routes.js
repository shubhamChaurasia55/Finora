import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/db.config.js";

dotenv.config();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

const cookieOptions = {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
};

const router = express.Router();

router.post("/register", async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if(userExists.rows.length > 0){
        return res.status(400).json({message: "User already exists"});
    }
    
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email, created_at`, [name, email, hashedPassword]);

    const token = generateToken(newUser.rows[0].id);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
        message: "User registered successfully",
        user: newUser.rows[0]
    });
});

router.post("/login", async(req, res) => {
    
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if(user.rows.length == 0) {
        return res.status(401).json({message: "Invalid credentials"})
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if(!validPassword) {
        return res.status(401).json({message: "Invalid credentials"})
    }

    const token = generateToken(user.rows[0].id);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
        message: "User logged in successfully",
        user: user.rows[0]
    });
    
});

router.post("/logout", (req, res) => {
    res.clearCookie("token",'',{...cookieOptions, maxAge: 1});
    return res.status(200).json({message: "User logged out successfully"});
});


export default router;