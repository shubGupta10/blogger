'use client'

import React, { useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import UserBlogs from '@/components/UserBlogs';
import { 
  Menu, 
  X, 
  PenSquare, 
  Globe, 
  Settings, 
  ChevronRight,
  BookOpen,
  User2,
  Mail,
  Layout
} from 'lucide-react';
import { useMyContext } from '@/context/ContextProvider';
import { GetBlogsByUserDocument, GetBlogsByUserQuery, GetBlogsByUserQueryVariables } from '@/gql/graphql';
import { useQuery } from '@apollo/client';

interface NavButtonProps {
  href: string;
  children: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
}

const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.98 }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};


const Dashboard: React.FC = () => {
  const { user } = useMyContext(); 
  const userData = user; 


  const { data } = useQuery<GetBlogsByUserQuery, GetBlogsByUserQueryVariables>(GetBlogsByUserDocument);

  
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuVariants: Variants = {
    closed: { 
      opacity: 0,
      height: 0,
    },
    open: { 
      opacity: 1,
      height: 'auto',
    }
  };

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.header
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={userData?.profilePicture} 
                    alt={`${userData?.firstName} ${userData?.lastName}`}
                    className="w-16 h-16 rounded-full border-2 border-black"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-black">
                    Welcome back, {userData?.firstName}!
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail size={14} />
                    {userData?.email}
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <NavButton href="/pages/createBlog" icon={<PenSquare size={18} />}>
                  New Blog
                </NavButton>
                <NavButton href="/pages/settings" icon={<Settings size={18} />}>
                  Settings
                </NavButton>
              </div>

              <button
                className="md:hidden absolute top-8 right-6 text-black focus:outline-none hover:bg-gray-100 p-2 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="md:hidden border-t border-gray-200"
              >
                <div className="p-4 ">
                  <NavButton href="/pages/settings" icon={<Settings size={18} />} onClick={toggleMenu}>
                    Settings
                  </NavButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <BookOpen size={24} className="text-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                  <h3 className="text-2xl font-bold">{data?.blogsByUser?.length}</h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Layout size={24} className="text-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Latest Blog</p>
                  <h3 className="text-sm font-medium truncate max-w-[180px]">
                    {userData?.blogs[data?.blogsByUser?.length - 1]?.title || 'No blogs yet'}
                  </h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Globe size={24} className="text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quick Actions</p>
                    <h3 className="text-sm font-medium">Manage your blog posts</h3>
                  </div>
                </div>
                <Link 
                  href="/pages/createBlog"
                  className="inline-flex gap-2 bg-black items-center md:gap-4 p-2 md:p-4 rounded-xl text-sm font-medium text-white"
                >
                  Create new blog
                  <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Recent Blogs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Recent Blogs</h2>
                <Link 
                  href="/pages/Dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data?.blogsByUser.slice(0, 3).map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-black" />
                      <h3 className="font-medium">{blog.title}</h3>
                    </div>
                    <Link 
                      href={`/pages/blogs/${blog._id}`}
                      className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                    >
                      View
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <UserBlogs />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const NavButton: React.FC<NavButtonProps> = ({ href, children, icon, onClick }) => (
  <Link href={href} className="w-full md:w-auto">
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      onClick={onClick}
    >
      {icon}
      {children}
    </motion.button>
  </Link>
);

export default Dashboard;