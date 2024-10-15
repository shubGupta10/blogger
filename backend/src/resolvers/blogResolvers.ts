import Blog from "../model/BlogModel.js";
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
          

        updateBlog: async (_parent: unknown, { input }: { input: updateBlogInput }) => {
            try {
                const { blogId, title, blogImage, blogContent } = input;

                const updatedBlog = await Blog.findByIdAndUpdate(
                    blogId,
                    { title, blogImage, blogContent },
                    { new: true } 
                );

                if (!updatedBlog) {
                    throw new Error("Blog not found");
                }

                return updatedBlog; 
            } catch (error: any) {
                console.error("Failed to update blog", error);
                throw new Error(error.message || "Failed to update blog");
            }
        },

        deleteBlog: async (_parent: unknown, { blogId }: { blogId: string }) => {
            try {
                const deletedBlog = await Blog.findByIdAndDelete(blogId);

                if (!deletedBlog) {
                    throw new Error("Blog not found");
                }

                return deletedBlog; 
            } catch (error: any) {
                console.error("Failed to delete blog", error);
                throw new Error(error.message || "Failed to delete blog");
            }
        },
    },

    Query: {
        blogs: async (_parent: unknown, _args: unknown, context: MyContext) => {
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
    },
};

export default blogResolver;
