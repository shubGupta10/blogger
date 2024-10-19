import jwt from 'jsonwebtoken';
import { Request as ExpressRequest, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

interface AuthenticatedRequest extends ExpressRequest {
  user?: any;
  cookies: {
    token?: string;
  };
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response) => {
  const token = req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('token='))?.split('=')[1];
  
  console.log("Extracted token:", token);

  if (!token) {
    return null;
  }

  try {
    const userData = jwt.verify(token, JWT_SECRET);
    req.user = userData;
    return userData;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

export default authMiddleware;