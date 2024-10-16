'use client'

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BLOGS } from '@/Graphql/queries/blogQueries';
import { GetBlogsQuery } from '@/gql/graphql';
import { motion } from 'framer-motion';
import { User, Calendar, ArrowRight } from 'lucide-react';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';

const PublicBlogs: React.FC = () => {
  const { loading, error, data } = useQuery<GetBlogsQuery>(GET_BLOGS);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); 

  if (loading) return <div><Loader /></div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error.message}</div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const handleOpenBlogs = async (BlogId: string) => {
    setIsLoading(true); 
    await router.push(`/pages/viewBlog/${BlogId}`);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-12 text-center">Explore Our Blog</h1>
        {data?.blogs && data.blogs.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">No blogs found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {data?.blogs.map((blog) => (
              <motion.div
                key={blog._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
                variants={itemVariants}
              >
                {blog.blogImage && (
                  <img
                    src={blog.blogImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{blog.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.blogContent}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User size={16} className="mr-2" />
                    <span className="mr-4">
                      {blog.user.firstName} {blog.user.lastName ?? ''}
                    </span>
                    <Calendar size={16} className="mr-2" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
                    onClick={() => handleOpenBlogs(blog._id)} 
                  >
                    <div className='flex justify-center items-center'>
                      {isLoading ? <Loader /> : <>Read More <ArrowRight size={16} className="ml-2" /></>}
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PublicBlogs;
