'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GET_AUTHENTICATED_USER } from '@/Graphql/queries/userQueries';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import { LogoutDocument } from '@/gql/graphql';
import { LogoutMutation, LogoutMutationVariables } from '@/gql/graphql';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

const Navbar = () => {
  
  interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    gender: string;
  }

 
  const { loading, data } = useQuery(GET_AUTHENTICATED_USER);
  const [logout] = useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const router = useRouter(); 

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const toggleNavbar = useCallback(() => {
    setIsNavbarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!loading && data) {
      setUser(data.authenticatedUser);
    }
  }, [loading, data]);

  const isAuthenticated = !!user;

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.data?.logout) {
        localStorage.setItem('userAuth', 'false');
       router.push('/Auth/login'); 
        toast.success('Logout successful!');
        window.location.reload()
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  if (loading) {
    return <Loader />;
  }



  return (
    <>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 relative w-full z-30">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://www.svgrepo.com/show/144580/blog.svg" className="h-8" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900 dark:text-white">Blogger</span>
          </Link>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {isAuthenticated ? (
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Open user sidebar</span>
                <img className="w-8 h-8 rounded-full" src={user?.profilePicture} alt={`${user?.firstName} ${user?.lastName}`} />
              </button>
            ) : (
              <Link href="/Auth/login" className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Get Started
              </Link>
            )}

            <button
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={toggleNavbar}
              aria-controls="navbar-user"
              aria-expanded={isNavbarOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>

          <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isNavbarOpen ? 'block' : 'hidden'}`} id="navbar-user">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
              <li>
                <Link href="/" className={`block py-2 px-3 ${window.location.href === '/' ? 'bg-black text-white' : 'text-gray-900'} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`} aria-current="page">Home</Link>
              </li>
              <li>
                <Link href="/pages/publicBlogs" className={`block py-2 px-3 ${window.location.href === '/pages/publicBlogs' ? 'bg-black text-white' : 'text-gray-900'} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}>Public Blogs</Link>
              </li>
              <li>
                <Link href="/pages/Dashboard" className={`block py-2 px-3 ${window.location.href === '/pages/Dashboard' ? 'bg-black text-white' : 'text-gray-900'} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}>Dashboard</Link>
              </li>
              <li>
                <Link href="/pages/createBlog" className={`block py-2 px-3 ${window.location.href === '/pages/createBlog' ? 'bg-black text-white' : 'text-gray-900'} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}>Create Blog</Link>
              </li>
              <li>
                <Link href="https://shubgupta.vercel.app" className={`block py-2 px-3 ${window.location.href === '/contact' ? 'bg-black text-white' : 'text-gray-900'} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}>Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleSidebar}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 w-72 md:w-80 h-full bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={toggleSidebar}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {user && (
                  <div className="flex flex-col items-center">
                    <img className="w-20 h-20 rounded-full shadow-lg" src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                    <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{`${user.firstName} ${user.lastName}`}</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                )}

                <nav className="mt-6">
                  <ul className="space-y-2">
                    <li>
                      <Link href="/pages/Dashboard" className="block py-2 px-4 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 dark:hover:text-white transition-colors duration-200">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/settings" className="block py-2 px-4 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 dark:hover:text-white transition-colors duration-200">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-2 px-4 text-white bg-red-500 rounded-lg hover:bg-red-700 dark:hover:bg-gray-700 dark:text-white dark:hover:text-white transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
