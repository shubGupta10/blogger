import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
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
    }
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;
