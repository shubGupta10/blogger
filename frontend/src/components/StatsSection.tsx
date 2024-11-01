import React, { useState, useEffect } from 'react';
import { User, Users2, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GetBlogsDocument, GetBlogsQuery } from '@/gql/graphql';
import { GetAllUsersDocument, GetAllUsersQuery, GetAllUsersQueryVariables } from '@/gql/graphql';
import { useQuery } from '@apollo/client';

const StatsSection = () => {
  const [totalShares, setTotalShares] = useState(0);
  const { data: userData } = useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument);
  const { data: blogData } = useQuery<GetBlogsQuery>(GetBlogsDocument);

  useEffect(() => {
    const loadData = () => {
      setTotalShares(25); 
    };
    loadData();
  }, []);

  const stats = [
    { icon: User, title: 'Current Users', value: userData?.users?.length || 0 },
    { icon: Users2, title: 'Overall Blogs', value: blogData?.blogs?.length || 0 },
    { icon: Share, title: 'Total Blog Shares', value: totalShares },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-[#0a0a0a]">
      <h1  className="text-3xl sm:text-4xl font-bold mb-12 text-center">Users Realtime Engagement</h1>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center mb-4">
                <stat.icon className="w-12 h-12 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="text-xl font-medium text-center mb-2 text-gray-700 dark:text-gray-300">{stat.title}</h3>
              <AnimatePresence>
                <motion.div
                  key={stat.value}
                  className="text-3xl font-bold text-center text-gray-900 dark:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {stat.value}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;