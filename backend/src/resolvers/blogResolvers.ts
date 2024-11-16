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
    blogCategory: string;
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
                const { title, blogImage, blogContent, blogCategory } = input;
          
                if (!title || !blogImage || !blogContent || !blogCategory) {
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
                    blogCategory,
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

        likeBlog: async (_parent: unknown, {blogId}: {blogId: string}, context: MyContext) => {
            const userId = context.user._id;
            if(!userId){
                throw new Error("User should be authenticated!")
            }
    
            const blog = await Blog.findById(blogId);
            if(!blog){
                throw new Error("Failed to find blog")
            }
    
            if(!blog.likedBy.includes(userId)){
                blog.likedBy.push(userId);
                blog.likeCount += 1;
                await blog.save();
            }
    
            return blog.populate('likedBy');
        },
    
        unlikeBlog: async (_parent: unknown, {blogId}: {blogId: string}, context: MyContext) => {
            const userId = context.user._id;
            if(!userId){
                throw new Error("User must be authenticated!")
            }
    
            const blog = await Blog.findById(blogId);
            if(!blog){
                throw new Error("Blog not found");
            }
    
            const index = blog.likedBy.indexOf(userId);
            if(index !== -1){
                blog.likedBy.splice(index, 1);
                blog.likeCount -= 1;
                await blog.save()
            }
            return blog.populate('likedBy');
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
        },

        blogsByCategory: async (_parent: unknown, {blogCategory}: {blogCategory: string}) => {
            try {
                const blogs = await Blog.find({blogCategory})
                if (!blogs || blogs.length === 0) {
                    throw new Error("No blogs found in this category");
                }
                return blogs
            } catch (error: any) {
                console.error("Failed to fetch blogs by user", error);
                throw new Error(error.message || "Internal server error");
            }
        },

        blogsByCategories: async (_parent: unknown, { blogCategories }: { blogCategories: string[] }) => {
            try {
                const blogs = await Blog.find({ blogCategory: { $in: blogCategories } });
        
                if (!blogs || blogs.length === 0) {
                    throw new Error("No blogs found in these categories");
                }
        
                return blogs;
            } catch (error: any) {
                console.error("Failed to fetch blogs by categories", error);
                throw new Error(error.message || "Internal server error");
            }
        }
        
    },
};

export default blogResolver;