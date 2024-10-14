import User from "../model/userModel.js";
import bcrypt from 'bcryptjs';
import generateToken from "../utils/jwt.js";
const userResolver = {
    Mutation: {
        signUp: async (_parent, { input }, context) => {
            try {
                const { firstName, lastName, email, password, gender } = input;
                if (!firstName || !email || !password || !gender) {
                    throw new Error("All required fields must be provided");
                }
                const existingUser = await User.findOne({ email });
                console.log("Fetched Email ", email);
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
                const userData = {
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
            }
            catch (error) {
                console.error("Failed to create User", error);
                throw new Error(error.message || "Internal Server error");
            }
        },
        login: async (_parent, { input }, context) => {
            try {
                const { email, password } = input;
                const user = await User.findOne({ email });
                if (!user) {
                    console.error("User not found for email:", email);
                    throw new Error("User not found");
                }
                const isPasswordMatch = await bcrypt.compare(password, user.password);
                if (!isPasswordMatch) {
                    throw new Error("Password is incorrect");
                }
                const userData = {
                    _id: user._id.toString(),
                };
                const token = generateToken(userData);
                if (!context.res) {
                    console.error("Response object is not available");
                    throw new Error("Response object is not available");
                }
                context.res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 3600 * 1000
                });
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
            }
            catch (error) {
                console.error("User login failed", error);
                throw new Error(error.message || "Internal Server error");
            }
        },
        logout: async (_parent, _args, context) => {
            try {
                if (!context.req || !context.res) {
                    throw new Error("Invalid context");
                }
                if (context.req.session) {
                    await new Promise((resolve, reject) => {
                        context.req.session.destroy((error) => {
                            if (error)
                                reject(error);
                            else
                                resolve();
                        });
                    });
                }
                context.res.clearCookie("token");
                return { message: "Logout successful" };
            }
            catch (error) {
                console.error("Logout failed", error);
                throw new Error(error.message || "Internal Server error");
            }
        }
    },
    Query: {
        authenticatedUser: async (_parent, _args, context) => {
            try {
                const user = await context.getUser();
                return user;
            }
            catch (error) {
                console.error("User is not authenticated", error);
                throw new Error(error.message || "Internal Server error");
            }
        },
        user: async (_parent, { userId }) => {
            try {
                const user = await User.findById(userId);
                return user;
            }
            catch (error) {
                console.error("Failed to find user", error);
                throw new Error(error.message || "Internal Server error");
            }
        }
    }
};
export default userResolver;
