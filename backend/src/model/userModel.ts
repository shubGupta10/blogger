import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePicture?: string;
    gender?: string;
    recommendedCategory: string[];
}

const userSchema: Schema<User> = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    profilePicture: {
        type: String,
    },
    gender: {
        type: String,
    },
    recommendedCategory: {
        type: [String],
        default: [],
      },
}, { timestamps: true });

const User = mongoose.model<User>("User", userSchema);

export default User;
