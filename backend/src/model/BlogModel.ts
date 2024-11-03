import mongoose, { Schema, Document, Types } from "mongoose";

export interface Blog extends Document {
    _id: string;
    title: string;
    blogImage: string;
    blogContent: string;
    blogCategory: string;
    likeCount: number;
    likedBy: Types.ObjectId[];
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
        enum: [
            'technology', 'programming', 'web development', 'mobile development', 'data science', 'artificial intelligence', 'cloud computing', 'devops', 'cybersecurity', 'sports', 'health', 'fitness', 'nutrition', 'mental health', 'lifestyle', 'fashion', 'beauty', 'travel', 'food', 'recipes', 'parenting', 'relationships', 'finance', 'investing', 'personal finance', 'real estate', 'education', 'science', 'astronomy', 'physics', 'chemistry', 'biology', 'entertainment', 'movies', 'music', 'tv shows', 'books', 'gaming', 'art', 'photography', 'politics', 'world news', 'history', 'environment', 'nature', 'animals', 'business', 'marketing', 'entrepreneurship', 'startups', 'productivity', 'self improvement', 'spirituality', 'philosophy'
        ],
        required: [true, 'Please select a category for this blog'],
    },
    likeCount: {
        type: Number,
        default: 0
    },
    likedBy: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    }
}, { timestamps: true });

const Blog = mongoose.model<Blog>("Blog", blogSchema);

export default Blog;
