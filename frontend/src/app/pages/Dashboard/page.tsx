'use client'
import React from 'react';
import { motion } from 'framer-motion';
import UserBlogs from '@/components/UserBlogs';

const Dashboard = () => {



  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <div className="flex space-x-4 mb-6">
            {['New Post', 'Analytics', 'Settings'].map((text, index) => (
              <motion.button
                key={index}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold transition duration-200 ease-in-out hover:bg-blue-600"
              >
                {text}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Blogs</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600">
              <UserBlogs/>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;