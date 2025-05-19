import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId, isAdmin, store) => {
    const secretKey = process.env.JWT_SECRET;
    return jwt.sign({ userId, isAdmin, store }, secretKey, { expiresIn: '1h' });
};

// Middleware to verify JWT
export const verifyToken = (req, res, next) => {
    // console.log("Headers received:", req.headers);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // console.log("Extracted token:", token);

    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        //console.error("JWT Verification Error:", error);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

