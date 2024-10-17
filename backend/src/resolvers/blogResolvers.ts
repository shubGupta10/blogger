import generateContent from "../geminiIntegration/generateContent.js";
import Blog from "../model/BlogModel.js";
import User from "../model/userModel.js";
import { Request, Response } from "express";

export interface MyContext {
    user?: any;
    req: Request;
    res: Response;
}

interface createBlogInput {
    title: string;
    blogImage: string;
    blogContent: string;
}

interface updateBlogInput {
    blogId: string;
    title: string;
    blogImage: string;
    blogContent: string;
}

const blogResolver = {
    Blog: {
        user: async (parent: any) => {
            try {
                return await User.findById(parent.userId);
            } catch (error: any) {
                console.error("Failed to fetch user for blog", error);
                throw new Error("Failed to fetch user for blog");
            }
        },
    },

    Mutation: {
        createBlog: async (_parent: unknown, { input }: { input: createBlogInput }, context: MyContext) => {
            try {
                const { title, blogImage, blogContent } = input;
          
                if (!title || !blogImage || !blogContent) {
                    throw new Error("All fields are required");
                }
          
                const userId = context.user?._id;
                if (!userId) {
                    throw new Error("User must be authenticated to create a blog");
                }
          
                const newBlog = new Blog({
                    title,
                    blogImage,
                    blogContent,
                    userId,  
                });
          
                await newBlog.save();
          
                return newBlog;
            } catch (error: any) {
                console.error("Failed to create new blog", error);
                throw new Error(error.message || "Internal server error");
            }
        },

        updateBlog: async (_parent: unknown, { input }: { input: updateBlogInput }, context: MyContext) => {
            try {
                const { blogId, title, blogImage, blogContent } = input;
                const userId = context.user?._id;
                if (!userId) {
                    throw new Error("User must be authenticated to update a blog");
                }

                const updatedBlog = await Blog.findOneAndUpdate(
                    { _id: blogId, userId },
                    { title, blogImage, blogContent },
                    { new: true } 
                );

                if (!updatedBlog) {
                    throw new Error("Blog not found or user not authorized");
                }

                return updatedBlog; 
            } catch (error: any) {
                console.error("Failed to update blog", error);
                throw new Error(error.message || "Failed to update blog");
            }
        },

        deleteBlog: async (_parent: unknown, { blogId }: { blogId: string }, context: MyContext) => {
            try {
                const userId = context.user?._id;
                if (!userId) {
                    throw new Error("User must be authenticated to delete a blog");
                }

                const deletedBlog = await Blog.findOneAndDelete({ _id: blogId, userId });

                if (!deletedBlog) {
                    throw new Error("Blog not found or user not authorized");
                }

                return deletedBlog; 
            } catch (error: any) {
                console.error("Failed to delete blog", error);
                throw new Error(error.message || "Failed to delete blog");
            }
        },

        generateStory: async (_parent: unknown, {prompt}: {prompt: string}, context: MyContext) => {
            const userId = context.user._id

            if(!userId){
                throw new Error("User should be authenticated!")
            }
            return await generateContent(prompt)
        },
    },

    Query: {
        blogs: async () => {
            try {
                const blogs = await Blog.find();
                return blogs;
            } catch (error: any) {
                console.error("Failed to get blogs", error);
                throw new Error(error.message || "Internal server error");
            }
        },

        blog: async (_parent: unknown, { blogId }: { blogId: string }) => {
            try {
                const blog = await Blog.findById(blogId);
                if (!blog) {
                    throw new Error("Blog not found");
                }
                return blog;
            } catch (error: any) {
                console.error("Failed to fetch blog", error);
                throw new Error(error.message || "Internal server error");
            }
        },

        blogsByUser: async (_parent: unknown, _args: unknown, context: MyContext) => {
            try {
                const userId = context.user?._id;
                
                if (!userId) {
                    throw new Error("User must be authenticated to fetch blogs");
                }
                const blogs = await Blog.find({ userId });
                return blogs;
            } catch (error: any) {
                console.error("Failed to fetch blogs by user", error);
                throw new Error(error.message || "Internal server error");
            }
        }
    },
};

export default blogResolver;