import mongoose, { Schema, Document, Types } from "mongoose";

export interface Blog extends Document {
    _id: string;
    title: string;
    blogImage: string;
    blogContent: string;
    blogCategory: string;
    createdAt: Date;
    userId: Types.ObjectId; 
}

const blogSchema: Schema<Blog> = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    blogImage: {
        type: String,
        required: [true, "Blog image is required"],
    },
    blogContent: {
        type: String,
        required: [true, "Blog content is required"],
    },
    blogCategory: {
        type: String,
        enum: ['technology', 'lifestyle', 'education', 'health', 'travel'],
        required: [true, 'Please select a category for this blog'],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: [true, "User ID is required"],
    }
}, { timestamps: true });

const Blog = mongoose.model<Blog>("Blog", blogSchema);

export default Blog;
