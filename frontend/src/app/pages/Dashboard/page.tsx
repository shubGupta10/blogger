'use client'

import React, { useState } from 'react';
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
  Mail,
  Layout,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useMyContext } from '@/context/ContextProvider';
import { GetBlogsByUserDocument, GetBlogsByUserQuery, GetBlogsByUserQueryVariables } from '@/gql/graphql';
import { useQuery } from '@apollo/client';
import { Button } from '@/components/ui/button';
import ChooseCategoryPage from '@/components/ChooseCategoryPage';
import { cn } from '@/lib/utils';

interface NavButtonProps {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
}

const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
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

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black/95">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.header
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl backdrop-blur-sm mb-8"
        >
          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                  <img
                    src={userData?.profilePicture}
                    alt={`${userData?.firstName} ${userData?.lastName}`}
                    className="relative w-16 h-16 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Welcome back, {userData?.firstName}!
                    </h1>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {userData?.email}
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <NavButton href="/pages/createBlog" icon={<PenSquare className="w-4 h-4" />}>
                  New Blog
                </NavButton>
                <NavButton href="/pages/settings" icon={<Settings className="w-4 h-4" />}>
                  Settings
                </NavButton>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden absolute top-8 right-8"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="md:hidden border-t border-gray-200 dark:border-gray-800"
              >
                <div className="p-4 space-y-2">
                  <NavButton href="/pages/createBlog" icon={<PenSquare className="w-4 h-4" />}>
                    New Blog
                  </NavButton>
                  <NavButton href="/pages/settings" icon={<Settings className="w-4 h-4" />}>
                    Settings
                  </NavButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Stats Grid */}
        <div className="grid gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <BookOpen className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Blogs</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data?.blogsByUser?.length || 0}
                  </h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Layout className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Latest Blog</p>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                    {userData?.blogs[data?.blogsByUser?.length - 1]?.title || 'No blogs yet'}
                  </h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 sm:col-span-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Globe className="w-6 h-6 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quick Actions</p>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Manage your blog posts</h3>
                  </div>
                </div>
                <Link
                  href="/pages/createBlog"
                  className="inline-flex items-center gap-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                >
                  Create new blog
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          <ChooseCategoryPage />

          {/* Recent Blogs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg backdrop-blur-sm"
          >
            <div className="border-b border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Recent Blogs</h2>
                <Link
                  href="/pages/Dashboard"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data?.blogsByUser
                  ?.slice()
                  .reverse()
                  .slice(0, 4)
                  .map((blog, index) => (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl",
                        "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                        "transition-all duration-300"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <h3 className="font-medium text-gray-900 dark:text-white">{blog.title}</h3>
                      </div>
                      <Link
                        href={`/pages/blogs/${blog._id}`}
                        className="group flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                      >
                        View
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
          

          {/* User Blogs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg backdrop-blur-sm"
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
      className={cn(
        "w-full md:w-auto inline-flex items-center justify-center gap-2",
        "bg-black dark:bg-white text-white dark:text-black",
        "px-4 py-2.5 rounded-xl font-medium text-sm",
        "transition-all duration-300",
        "hover:bg-gray-800 dark:hover:bg-gray-100",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      )}
      onClick={onClick}
    >
      {icon}
      {children}
    </motion.button>
  </Link>
);

export default Dashboard;