'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import UserBlogs from '@/components/UserBlogs';

const Dashboard = () => {
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-10 flex flex-col md:flex-row justify-between items-center"
        >
          <h1 className="text-4xl font-extrabold text-black mb-4 md:mb-0">
            Dashboard
          </h1>
          <div className="flex space-x-6">
            <Link href="/pages/createBlog">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-black text-white px-5 py-3 rounded-lg font-semibold transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-md focus:outline-none"
              >
                New Post
              </motion.button>
            </Link>
            <Link href="/pages/publicBlogs">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-black text-white px-5 py-3 rounded-lg font-semibold transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-md focus:outline-none"
              >
                Public Blogs
              </motion.button>
            </Link>
            <Link href="#">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-black text-white px-5 py-3 rounded-lg font-semibold transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-md focus:outline-none"
              >
                Analytics
              </motion.button>
            </Link>
            <Link href="/settings">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-black text-white px-5 py-3 rounded-lg font-semibold transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-md focus:outline-none"
              >
                Settings
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-black mb-8">
            Your Blogs
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Placeholder for User Blogs Component */}
            <div className="text-gray-800">
              <UserBlogs />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
