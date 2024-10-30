import React, { useState, useEffect } from 'react';
import { User, Users2, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GetBlogDocument, GetBlogQuery, GetBlogQueryVariables, GetBlogsDocument, GetBlogsQuery } from '@/gql/graphql';
import { GetAllUsersDocument, GetAllUsersQuery, GetAllUsersQueryVariables } from '@/gql/graphql';
import { useQuery } from '@apollo/client';

const StatsSection = () => {
  const [totalShares, setTotalShares] = useState(0);
  const {data} = useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument)
  const {data: blogData} = useQuery<GetBlogsQuery>(GetBlogsDocument)
  
  

  useEffect(() => {
    const loadData = () => {
      setTotalShares(25);
    };
    loadData();
  }, []);

  return (
    <section className="py-20 flex justify-evenly gap-8">
      <motion.div
        className="flex flex-col items-center bg-white dark:bg-[#0a0a0a] shadow-lg rounded-xl p-6 w-72"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <div>
            <User className="w-14 h-14 text-gray-700 dark:text-white" />
          </div>
        </div>
        <div className="font-medium mb-2 text-gray-700 dark:text-white">Current Users</div>
        <AnimatePresence>
          <motion.div
            className="font-bold text-4xl text-gray-800 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {data?.users?.length}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="flex flex-col items-center bg-white dark:bg-[#0a0a0a] shadow-lg rounded-lg p-6 w-72"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-4">
          <div
          >
            <Users2 className="w-14 h-14 text-gray-700 dark:text-white" />
          </div>
        </div>
        <div className="font-medium mb-2 text-gray-700 dark:text-white">Overall Blogs</div>
        <AnimatePresence>
          <motion.div
            className="font-bold text-4xl text-gray-800 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {blogData?.blogs?.length}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="flex flex-col items-center bg-white dark:bg-[#0a0a0a] shadow-lg rounded-lg p-6 w-72"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="mb-4">
          <div
          >
            <Share className="w-14 h-14 text-gray-700 dark:text-white" />
          </div>
        </div>
        <div className="font-medium mb-2 text-gray-700 dark:text-white">Total Blog Shares</div>
        <AnimatePresence>
          <motion.div
            className="font-bold text-4xl text-gray-800 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {totalShares}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default StatsSection;