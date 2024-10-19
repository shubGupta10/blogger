import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export interface AuthenticatedRequest extends Request {
  user?: any;
}

const authMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    console.log("Extracted token:", token);
    if (!token) {
      return next();
    }

    try {
      const userData = jwt.verify(token, JWT_SECRET);
      (req as AuthenticatedRequest).user = userData;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      next();
    }
  };
};

export default authMiddleware;