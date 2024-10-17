'use client'

import { useMutation, useQuery } from '@apollo/client';
import { GET_BLOGS_BY_USER } from '@/Graphql/queries/blogQueries';
import { Trash2, Edit3, Eye, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { DeleteBlogDocument, DeleteBlogMutation, DeleteBlogMutationVariables } from '@/gql/graphql';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Blog {
  _id: string;
  title: string;
  blogImage: string;
  blogContent: string;
  createdAt: string;
}

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

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 }
};

const UserBlogs = () => {
  const { data, loading, error } = useQuery(GET_BLOGS_BY_USER);
  const [deleteBlog] = useMutation<DeleteBlogMutation, DeleteBlogMutationVariables>(DeleteBlogDocument, {
    refetchQueries: [{ query: GET_BLOGS_BY_USER }],
  });
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div></div>;
  if (error) return <p className="text-center text-red-500 p-4">Error loading blogs: {error.message}</p>;

  const blogs = data?.blogsByUser || [];

  const handleDelete = async (blogId: string) => {
    try {
      await deleteBlog({ variables: { blogId } });
      toast.success('Blog deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete blog');
    }
  };

  const handleEdit = (blogId: string) => {
    router.push(`/pages/EditBlogs/${blogId}`);
  };

  const handleOpen = (blogId: string) => {
    router.push(`/pages/blogs/${blogId}`);
  };

  const filteredBlogs = blogs.filter((blog: Blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.blogContent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">My Blogs</h1>
      <div className='mb-8 max-w-md mx-auto'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search in your blogs...'
            className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      <AnimatePresence>
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredBlogs.length === 0 ? (
            <p className="text-center  text-gray-500 text-xl">No blogs found matching your search.</p>
          ) : (
            filteredBlogs.map((blog: Blog) => (
              <motion.div
                key={blog._id}
                className="flex flex-col sm:flex-row border border-gray-200 bg-white text-black p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                variants={itemVariants}
              >
                <img
                  src={blog.blogImage}
                  alt={blog.title}
                  className="w-full sm:w-1/4 h-48 sm:h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
                />
                <div className="flex-grow">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">{blog.title}</h2>
                  <p
                    className="text-gray-600 mb-4 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: blog.blogContent }}
                  />
                  <p className="text-sm text-gray-500 mb-4">Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      className="flex items-center space-x-1 bg-black text-white px-3 py-2 rounded-md text-sm"
                      onClick={() => handleOpen(blog._id)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </motion.button>
                    <motion.button
                      className="flex items-center space-x-1 bg-black text-white px-3 py-2 rounded-md text-sm"
                      onClick={() => handleEdit(blog._id)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      className="flex items-center space-x-1 bg-black text-white px-3 py-2 rounded-md text-sm"
                      onClick={() => handleDelete(blog._id)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UserBlogs;