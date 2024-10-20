'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { useMyContext } from '@/context/ContextProvider';

const UserProfile = () => {
  const { user } = useMyContext();

  if (!user) return <div className="text-center text-3xl text-red-600">User is not authenticated</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center w-full max-w-full space-y-10"
      >
        <motion.div
          className="w-48 h-48 rounded-full overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <img
            src={user.profilePicture}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">{user.email}</p>
          <p className="text-lg text-gray-400 dark:text-gray-500">
            Gender: {user.gender}
          </p>
          <p className="text-lg text-gray-400 dark:text-gray-500">
            Blogs Created: {user.blogs.length}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
