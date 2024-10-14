// authMiddlewares.ts
import jwt from 'jsonwebtoken';
import { Request as ExpressRequest, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface Request extends ExpressRequest {
    user?: any; 
    cookies: {
        token?: string; 
    };
}

const authMiddleware = async (req: Request, res: Response) => {
    const token = req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('token='))?.split('=')[1];
    
    console.log("Extracted token:", token);

    if (!token) {
        return null; 
    }

    try {
        const userData = jwt.verify(token, JWT_SECRET);
        req.user = userData; 
        return userData; 
    } catch (error: any) {
        console.error("Token verification error:", error);
        return null; 
    }
};

export default authMiddleware;
