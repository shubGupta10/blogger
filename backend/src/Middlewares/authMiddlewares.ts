import jwt from 'jsonwebtoken';
import { Request as ExpressRequest, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface Request extends ExpressRequest {
    user?: any; 
    cookies: {
        token?: string; 
    };
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => { 
    const token = req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('token='))?.split('=')[1];
    
    console.log("Extracted token:", token);

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const userData = jwt.verify(token, JWT_SECRET);
        req.user = userData; 
        next(); 
    } catch (error: any) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Invalid token" }); 
    }
};

export default authMiddleware;
