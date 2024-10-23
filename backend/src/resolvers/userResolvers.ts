import User from '../model/userModel.js';
import Blog from "../model/BlogModel.js";
import bcrypt from 'bcryptjs';
import generateToken from "../utils/jwt.js";
import { Request, Response } from 'express';

interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: string;
  gender: string;
}

interface SignInInput {
  email: string;
  password: string;
}

interface UserData {
  _id: string;
}

export interface MyContext {
  user?: any;
  req: Request;
  res: Response;
}

import { Document } from 'mongoose';

export interface UserInterface extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: string;
  gender: string;
}

const userResolver = {
    User: {
        blogs: async (parent: UserInterface) => {
            try {
                return await Blog.find({ userId: parent._id });
            } catch (error: any) {
                console.error("Failed to fetch blogs for user", error);
                throw new Error("Failed to fetch blogs for user");
            }
        },
    },

    Mutation: {
        signUp: async (_parent: unknown, { input }: { input: SignUpInput }, context: any) => {
            try {
                const { firstName, lastName, email, password, gender } = input;
  
                if (!firstName || !email || !password || !gender) {
                    throw new Error("All required fields must be provided");
                }

                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error("User already exists");
                }
  
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
  
                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?firstname=${firstName}`;
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?firstname=${firstName}`;
  
                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === 'male' ? boyProfilePic : girlProfilePic
                });
  
                await newUser.save();
  
                const userData: UserData = {
                    _id: newUser._id.toString(),
                };
  
                const token = generateToken(userData);
  
                return {
                    user: {
                        _id: newUser._id,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email, 
                        profilePicture: newUser.profilePicture,
                        gender: newUser.gender
                    },
                    token
                };
            } catch (error: any) {
                console.error("Failed to create User", error);
                throw new Error(error.message || "Internal Server error");
            }
        },
  
        login: async (_parent: unknown, { input }: { input: SignInInput }, context: any) => {
            try {
                const { email, password } = input;
        
                const user = await User.findOne({ email });
        
                if (!user) {
                    throw new Error("User not found");
                }
        
                const isPasswordMatch = await bcrypt.compare(password, user.password);
        
                if (!isPasswordMatch) {
                    throw new Error("Password is incorrect");
                }
        
                const userData: UserData = {
                    _id: user._id.toString(),
                };
        
                const token = generateToken(userData);
        
                if (!context.res) {
                    throw new Error("Response object is not available");
                }
        
                context.res.cookie('token', token, {
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production', 
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
                    domain: process.env.COOKIE_DOMAIN, 
                    path: '/', 
                });
        
                context.res.setHeader('Authorization', `Bearer ${token}`);
        
                return {
                    user: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        profilePicture: user.profilePicture,
                        gender: user.gender
                    },
                    token
                };
            } catch (error: any) {
                console.error("User login failed", error);
                throw new Error(error.message || "Internal Server error");
            }
        },
        
      
        logout: async (_parent: unknown, _args: unknown, context: any) => {
            try {
                if (!context.res) {
                    throw new Error("Invalid context");
                }
                context.res.clearCookie("token"); 
                return { message: "Logout successful" };
            } catch (error: any) {
                console.error("Logout failed", error);
                throw new Error(error.message || "Internal Server error");
            }
        }
        
    },
  
    Query: {
        authenticatedUser: async (_parent: unknown, _args: unknown, context: MyContext) => {
            try {
                const user = await User.findById(context.user._id);
                console.log("Context wala id", context.user._id);
                
                if (!user) {
                    throw new Error("User not found");
                }
                return user;
            } catch (error: any) {
                console.error("Failed to get authenticated user", error);
                throw new Error(error.message || "Internal Server error");
            }
        },
  
        user: async (_parent: unknown, _args: unknown, context: MyContext) => {
            try {
                const userId = context.user?._id;
                if (!userId) {
                    throw new Error("User not authenticated");
                }
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                return user;
            } catch (error: any) {
                console.error("Failed to find user", error);
                throw new Error(error.message || "Internal Server error");
            }
        },

        users: async () => {
            try {
                return await User.find();
            } catch (error: any) {
                console.error("Failed to fetch users", error);
                throw new Error(error.message || "Internal Server error");
            }
        },

        fetchUserByID: async (_parent: unknown, {userId}: {userId: string}) => {
            try {
                if(!userId){
                    throw new Error("User is not authenticated")
                }

                const user = await User.findById(userId);
                if(!user){
                    throw new Error("User not found")
                }
                return user;
            } catch (error: any) {
                console.error("Failed to fetch user", error);
                throw new Error(error.message || "Internal Server error");
            }
        }
    }
};
  
export default userResolver;