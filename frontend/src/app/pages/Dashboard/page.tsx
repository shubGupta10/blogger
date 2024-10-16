'use client'
import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import UserBlogs from '@/components/UserBlogs';
import { Menu, X } from 'lucide-react';

interface NavButtonProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
}
const buttonVariants: Variants = {
  initial: { scale: 1, boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)' },
  hover: { scale: 1.19, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' },
  tap: { scale: 0.95 }
};


const Dashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);


  const menuVariants: Variants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 }
  };

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black">
              Dashboard
            </h1>
            <div className="hidden md:flex space-x-4">
              <NavButton href="/pages/createBlog">New Post</NavButton>
              <NavButton href="/pages/publicBlogs">Public Blogs</NavButton>
              <NavButton href="#">Analytics</NavButton>
              <NavButton href="/pages/settings">Settings</NavButton>
            </div>
            <button
              className="md:hidden text-black focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="mt-4 md:hidden"
              >
                <div className="flex flex-col space-y-2">
                  <NavButton href="/pages/createBlog" onClick={toggleMenu}>New Post</NavButton>
                  <NavButton href="/pages/publicBlogs" onClick={toggleMenu}>Public Blogs</NavButton>
                  <NavButton href="#" onClick={toggleMenu}>Analytics</NavButton>
                  <NavButton href="/settings" onClick={toggleMenu}>Settings</NavButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">
            Your Blogs
          </h2>
          <div className="text-gray-800">
            <UserBlogs />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

const NavButton: React.FC<NavButtonProps> = ({ href, children, onClick }) => (
  <Link href={href}>
    <motion.button
    variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="bg-black text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none"
      onClick={onClick}
    >
      {children}
    </motion.button>
  </Link>
);

export default Dashboard;