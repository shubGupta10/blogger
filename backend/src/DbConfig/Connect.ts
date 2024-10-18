import mongoose from "mongoose";
import dotnev from 'dotenv'

dotnev.config()

const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Database connected successfully");
        
        mongoose.connection.on("error", (err: Error) => {
            console.error("Mongoose connection error: ", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Mongoose connection disconnected");
        });
    } catch (error: any) {
        console.error("DB connection failed", error);
        throw new Error(error.message || "Internal Server Error");
    }
};

export default connect;
