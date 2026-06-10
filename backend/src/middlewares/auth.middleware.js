import jwt from "jsonwebtoken";
import pool from "../config/db.config.js";
import dotenv from "dotenv";

dotenv.config();

const protact = async (req, res, next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await pool.query("SELECT * FROM users WHERE id = $1", [decodedToken.userId]);

        if(user.rows.length == 0) {
            return res.status(404).json({message: "User not found"});
        }

        req.user = user.rows[0];

        next();

    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
};

export default protact;