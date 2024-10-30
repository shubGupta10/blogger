import jwt from 'jsonwebtoken';

interface UserData {
    _id: string;
}

const generateToken = (userData: UserData): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(
        { _id: userData._id },  
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

export default generateToken;
