import jwt from 'jsonwebtoken';
const generateToken = (userData) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
};
export default generateToken;
