import jwt from 'jsonwebtoken';

interface UserData {
    _id: string;
}

const generateToken = (userData: UserData): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(
        userData, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export default generateToken;
