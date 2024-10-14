import User from "../model/userModel.js";
import bcrypt from 'bcryptjs';
import generateToken from "../utils/jwt.js";

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

const userResolver = {
    Mutation: {
      signUp: async (_parent: unknown, { input }: { input: SignUpInput }, context: any) => {
        try {
          const { firstName, lastName, email, password, gender } = input;
  
          if (!firstName || !email || !password || !gender) {
            throw new Error("All required fields must be provided");
          }

          const existingUser = await User.findOne({ email });
          console.log("Fetched Email " , email);
          
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
            console.error("User not found for email:", email);
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
        } catch (error: any) {
          console.error("User login failed", error);
          throw new Error(error.message || "Internal Server error");
        }
      },
      
  
      logout: async (_parent: unknown, _args: unknown, context: any) => {
        try {
          if (!context.req || !context.res) {
            throw new Error("Invalid context");
          }
  
          if (context.req.session) {
            await new Promise<void>((resolve, reject) => {
              context.req.session.destroy((error: any) => {
                if (error) reject(error);
                else resolve();
              });
            });
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
      authenticatedUser: async (_parent: unknown, _args: unknown, context: any) => {
        try {
          const user = await context.getUser();
          return user;
        } catch (error: any) {
          console.error("User is not authenticated", error);
          throw new Error(error.message || "Internal Server error");
        }
      },
  
      user: async (_parent: unknown, { userId }: { userId: string }) => {
        try {
          const user = await User.findById(userId);
          return user;
        } catch (error: any) {
          console.error("Failed to find user", error);
          throw new Error(error.message || "Internal Server error");
        }
      }
    }
  };
  
  export default userResolver;
  