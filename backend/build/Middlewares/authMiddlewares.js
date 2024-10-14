// authMiddlewares.ts
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = async (req, res) => {
    const token = req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('token='))?.split('=')[1];
    console.log("Extracted token:", token);
    if (!token) {
        return null;
    }
    try {
        const userData = jwt.verify(token, JWT_SECRET);
        req.user = userData;
        return userData;
    }
    catch (error) {
        console.error("Token verification error:", error);
        return null;
    }
};
export default authMiddleware;
