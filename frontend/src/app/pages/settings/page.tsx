'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMyContext } from '@/context/ContextProvider';

const Settings = () => {
  const [userId, setUserId] = useState<string | undefined>();
  const { user } = useMyContext();
  const router = useRouter();

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
    }
  }, [user]);

  const handleProfile = (userId: string | undefined) => {
    if (userId) {
      router.push(`/pages/userProfile/${userId}`);
    }
  };

  const handleContact = () => {
    router.push("https://shubgupta.vercel.app");
  };

  const handleChangeTheme = () => {
    router.push("/pages/ComingSoon");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center text-black dark:text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-12"
      >
        Settings
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div
          onClick={() => handleProfile(userId)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-black text-white dark:bg-white dark:text-black rounded-lg py-8 cursor-pointer transition-all hover:bg-gray-800 dark:hover:bg-gray-300"
        >
          <div className="text-xl font-semibold">User Profile</div>
        </motion.div>

        <motion.div
          onClick={handleChangeTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-black text-white dark:bg-white dark:text-black rounded-lg py-8 cursor-pointer transition-all hover:bg-gray-800 dark:hover:bg-gray-300"
        >
          <div className="text-xl font-semibold">Change Theme</div>
        </motion.div>

        <motion.div
          onClick={handleContact}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-black text-white dark:bg-white dark:text-black rounded-lg py-8 cursor-pointer transition-all hover:bg-gray-800 dark:hover:bg-gray-300"
        >
          <div className="text-xl font-semibold">Contact Developer</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;
