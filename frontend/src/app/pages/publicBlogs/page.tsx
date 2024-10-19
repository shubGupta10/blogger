'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BLOGS } from '@/Graphql/queries/blogQueries';
import { GetBlogsQuery } from '@/gql/graphql';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, ArrowRight, Search } from 'lucide-react';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';

const PublicBlogs: React.FC = () => {
  const { loading, error, data, refetch } = useQuery<GetBlogsQuery>(GET_BLOGS);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle refetch if needed for specific cases (e.g., after a mutation)
  useEffect(() => {
    refetch();
  }, []); 

  // Display loader while fetching the data from Apollo
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  // Display error message if the query fails
  if (error) {
    return (
      <div className="text-red-500 text-center mt-10 p-4 bg-white rounded-lg shadow">
        Error: {error.message}
      </div>
    );
  }

  // Variants for the animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const handleOpenBlogs = async (BlogId: string) => {
    setIsLoading(true); 
    router.push(`/viewBlog/${BlogId}`);
    setIsLoading(false); 
  };

  const filteredBlogs = data?.blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.blogContent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-8 text-center">
          Explore Our Blogs
        </h1>

        {/* Search input */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Display message when no blogs are found */}
        {filteredBlogs && filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-500 text-xl bg-white p-6 rounded-lg shadow">
            No blogs found.
          </p>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlogs?.map((blog) => (
                <motion.div
                  key={blog._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
                  variants={itemVariants}
                >
                  <div className="relative h-48 overflow-hidden">
                    {blog.blogImage && (
                      <img
                        src={blog.blogImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h2 className="text-xl font-bold truncate">{blog.title}</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <p
                      className="text-gray-600 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: blog.blogContent }}
                    />
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <User size={16} className="mr-2" />
                      <span className="mr-4 truncate">
                        {blog.user.firstName} {blog.user.lastName ?? ''}
                      </span>
                      <Calendar size={16} className="mr-2" />
                      <span>{new Date(parseInt(blog.createdAt)).toLocaleDateString()}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
                      onClick={() => handleOpenBlogs(blog._id)}
                    >
                      {isLoading ? (
                        <Loader /> // Show custom loader for navigation only
                      ) : (
                        <>
                          Read More
                          <ArrowRight size={16} className="ml-2" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default PublicBlogs;
