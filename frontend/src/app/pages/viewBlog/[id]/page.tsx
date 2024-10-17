'use client'
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries';
import { GetBlogQuery, GetBlogQueryVariables } from '@/gql/graphql';
import { ChevronDown, Calendar, User } from 'lucide-react';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';

const BlogDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [userId, setUserId] = useState('')
  const router = useRouter()

  useEffect(() => {
    setUserId(id)
  },[id])

  const handleOpenPublicProfile = (userId: string) => {
    router.push(`/pages/publicUserProfile/${userId}`)
  }

  const { data, loading, error } = useQuery<GetBlogQuery, GetBlogQueryVariables>(GET_SINGLEBLOG, {
    variables: { blogId: id },
  });

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Loader/>
    </div>
  );

  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-red-500 p-6 bg-black min-h-screen flex items-center justify-center"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error.message}</p>
      </div>
    </motion.div>
  );

  const blog = data?.blog;

  if (!blog) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center p-6 bg-black min-h-screen flex items-center justify-center text-white"
    >
      <h2 className="text-3xl font-bold">Blog not found</h2>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-screen bg-black"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        <img src={blog.blogImage} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl mb-8 font-bold text-white"
          >
            {blog.title}
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-4 cursor-pointer text-white"
            onClick={() => handleOpenPublicProfile(userId)}
          >
            <img
              src={blog.user?.profilePicture || '/api/placeholder/100/100'}
              alt={blog.user?.firstName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
            <div>
              <p className="font-semibold">{`${blog.user?.firstName} ${blog.user?.lastName}`}</p>
              <p className="text-sm text-gray-300">{blog.user?.email}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center space-x-4 mb-8 text-white"
        >
          <Calendar size={20} />
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <User size={20} />
          <span>{`${blog.user?.firstName} ${blog.user?.lastName}`}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`prose prose-lg prose-invert max-w-none mb-8 ${isContentExpanded ? '' : 'line-clamp-5'}`}
          dangerouslySetInnerHTML={{ __html: blog.blogContent }}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsContentExpanded(!isContentExpanded)}
          className="flex items-center justify-center w-full py-4 bg-white text-black rounded-lg font-semibold mt-4 transition-colors duration-300 hover:bg-gray-200"
        >
          {isContentExpanded ? 'Read Less' : 'Read More'}
          <ChevronDown className={`ml-2 transform transition-transform duration-300 ${isContentExpanded ? 'rotate-180' : ''}`} />
        </motion.button>
      </div>
    </div>
  );
};

export default BlogDetails;
