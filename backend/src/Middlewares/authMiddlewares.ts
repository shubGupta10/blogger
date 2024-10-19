import jwt from 'jsonwebtoken';
import { Request as ExpressRequest, Response } from 'express';
import cookie from 'cookie'; 

const JWT_SECRET = process.env.JWT_SECRET as string;

interface Request extends ExpressRequest {
    user?: any; 
    cookies: {
        token?: string; 
    };
}

const authMiddleware = async (req: Request, res: Response) => {
    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.token;

        console.log("Extracted token:", token);

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const userData = jwt.verify(token, JWT_SECRET);
        req.user = userData; 
        return userData; 

    } catch (error: any) {
        console.error("Token verification error:", error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }

        return res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;
