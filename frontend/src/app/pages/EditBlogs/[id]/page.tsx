'use client';

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATEBLOG } from '@/Graphql/mutations/blogMutations'; 
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries'; 
import { UpdateBlogMutation, UpdateBlogInput } from '@/gql/graphql';
import { GetBlogQuery, GetBlogQueryVariables } from '@/gql/graphql';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

const EditBlogs = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();

  const { data, loading, error } = useQuery<GetBlogQuery, GetBlogQueryVariables>(GET_SINGLEBLOG, {
    variables: { blogId: id }
  });

  const [updateBlog] = useMutation<UpdateBlogMutation, { input: UpdateBlogInput }>(UPDATEBLOG);
  const [title, setTitle] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogContent, setBlogContent] = useState('');

  useEffect(() => {
    if (data && data.blog) {
      const { title, blogImage, blogContent } = data.blog;
      setTitle(title);
      setBlogImage(blogImage);
      setBlogContent(blogContent);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBlog({
        variables: {
          input: {
            blogId: id,
            title,
            blogImage,
            blogContent,
          },
        },
      });
      router.push("/pages/Dashboard"); 
      toast.success("Blog updated")
    } catch (err) {
      console.error('Error updating blog:', err);
    }
  };

  if (loading) return <p className="text-center">
    <Loader/>
  </p>;
  if (error) return <p className="text-center text-red-600">Error loading blog: {error.message}</p>;

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 text-black p-6 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-5xl font-bold mb-6">Edit Your Blog</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        
        <div className="mb-6">
          <label className="block text-gray-800 mb-2" htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-black transition duration-200"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-800 mb-2" htmlFor="blogImage">Blog Image URL</label>
          <input
            type="text"
            id="blogImage"
            value={blogImage}
            onChange={(e) => setBlogImage(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-black transition duration-200"
          />
          {blogImage && (
            <img src={blogImage} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg shadow-md" />
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-800 mb-2" htmlFor="blogContent">Content</label>
          <textarea
            id="blogContent"
            value={blogContent}
            onChange={(e) => setBlogContent(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring focus:ring-black transition duration-200"
            rows={6}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200 w-full"
        >
          Update Blog
        </button>
      </form>
      
      <div className="mt-6 text-gray-600 text-center">
        <p>Review your changes carefully before submitting.</p>
      </div>
    </motion.div>
  );
};

export default EditBlogs;
