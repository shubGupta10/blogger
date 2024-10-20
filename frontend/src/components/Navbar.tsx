'use client';
import React, { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { LogoutDocument } from '@/gql/graphql';
import { LogoutMutation, LogoutMutationVariables } from '@/gql/graphql';
import { motion, AnimatePresence } from 'framer-motion';
import { useMyContext } from '@/context/ContextProvider';

const Navbar = () => {
  const [logout] = useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser } = useMyContext();

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Check local storage for token
  const isAuthenticated = !!authUser || !!localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.data?.logout) {
        closeSidebar();
        router.push('/Auth/login'); 
        toast.success('Logout successful!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleNavigation = (href: string) => {
    closeSidebar();
    router.push(href);
  };

  const getLinkStyle = (href: string) => {
    const isActive = pathname === href;
    return `transition-colors duration-200 ${
      isActive ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
    }`;
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pages/publicBlogs', label: 'Public Blogs' },
    { href: '/pages/Dashboard', label: 'Dashboard' },
    { href: '/pages/createBlog', label: 'Create Blog' },
    { href: 'https://shubgupta.vercel.app', label: 'Contact' },
  ];

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 relative w-full z-30">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://www.svgrepo.com/show/144580/blog.svg" className="h-8" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900 dark:text-white">Blogger</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={getLinkStyle(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {isAuthenticated ? (
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Open user sidebar</span>
                <img className="w-8 h-8 rounded-full" src={authUser?.profilePicture} alt={`${authUser?.firstName} ${authUser?.lastName}`} />
              </button>
            ) : (
              <Link href="/Auth/login" className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Get Started
              </Link>
            )}

            {/* Mobile menu button */}
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
              onClick={closeSidebar}
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
                  onClick={closeSidebar}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {authUser && (
                  <div className="flex flex-col items-center">
                    <img className="w-20 h-20 rounded-full shadow-lg" src={authUser.profilePicture} alt={`${authUser.firstName} ${authUser.lastName}`} />
                    <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{`${authUser.firstName} ${authUser.lastName}`}</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{authUser.email}</p>
                  </div>
                )}

                <nav className="mt-6">
                  <ul className="space-y-2">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <button
                          onClick={() => handleNavigation(link.href)}
                          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 ${
                            pathname === link.href
                              ? 'bg-black text-white hover:bg-gray-800'
                              : 'text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white'
                          }`}
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                    {authUser && (
                      <>
                        <li>
                          <button
                            onClick={() => handleNavigation('/pages/settings')}
                            className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 ${
                              pathname === '/pages/settings'
                                ? 'bg-black text-white hover:bg-gray-800'
                                : 'text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white'
                            }`}
                          >
                            Settings
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left py-2 px-4 text-white bg-red-500 rounded-lg hover:bg-red-700 dark:hover:bg-gray-700 dark:text-white dark:hover:text-white transition-colors duration-200"
                          >
                            Sign out
                          </button>
                        </li>
                      </>
                    )}
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
