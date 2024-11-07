'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { LogoutDocument } from '@/gql/graphql';
import { LogoutMutation, LogoutMutationVariables } from '@/gql/graphql';
import { motion, AnimatePresence } from 'framer-motion';
import { useMyContext } from '@/context/ContextProvider';
import Cookies from 'js-cookie';
import ThemeSwitcher from './ThemeSwitcher';
import { Home, Book, PlusCircle, Mail, User, X, LogOut, LayoutDashboard, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Navbar = () => {
  const [logout] = useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser, setUser, token } = useMyContext();

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    const authToken = token;
    if (!authToken) {
      setUser(null);
    }
  }, [token]);

  const isAuthenticated = !!token;

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.data?.logout) {
        Cookies.remove('token');
        localStorage.clear();
        setUser(null);
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
      isActive 
        ? ' text-blue-500 font-semibold' 
        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
    }`;
  };
  
  
  
  const getLinkStyleForSideBar = (href: string) => {
    const isActive = pathname === href;
    return `transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-500 text-white font-semibold' 
        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
    }`;
  };
  



  const navLinks = [
    { href: '/pages/publicBlogs', label: 'Public Blogs', icon: <Book size={20} /> },
    { href: '/pages/Dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/pages/createBlog', label: 'Create Blog', icon: <PlusCircle size={20} /> },
    { href: '/pages/highestViews', label: 'Trending Blogs', icon: <TrendingUp size={20} /> },
  ];

  return (
    <>
      <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 relative w-full z-30 shadow">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://www.svgrepo.com/show/144580/blog.svg" className="h-8" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Blogger</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={getLinkStyle(link.href)}>
                <div className="flex items-center space-x-2">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex cursor-pointer gap-5 md:gap-8 items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="cursor-pointer w-4">
              <ThemeSwitcher />
            </div>
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
              <Link
                href="/Auth/login"
                className="text-white bg-black hover:bg-gray-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-white dark:text-black dark:hover:bg-gray-700 focus:outline-none"
              >
                Get Started
              </Link>
            )}
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
              className="fixed top-0 right-0 w-72 md:w-80 h-full bg-white dark:bg-black shadow-lg z-50 overflow-y-auto"
            >
              <Card className="h-full">
                <CardHeader className="flex justify-end">
                  <button
                    type="button"
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={closeSidebar}
                  >
                    <X size={24} />
                    <span className="sr-only">Close sidebar</span>
                  </button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isAuthenticated && (
                    <div className="flex flex-col items-center">
                      <img className="w-20 h-20 rounded-full shadow-lg" src={authUser?.profilePicture} alt={`${authUser?.firstName} ${authUser?.lastName}`} />
                      <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{`${authUser?.firstName} ${authUser?.lastName}`}</h2>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{authUser?.email}</p>
                    </div>
                  )}

                  <nav className="space-y-2">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <button
                          onClick={() => handleNavigation(link.href)}
                          className={`w-full flex items-center space-x-3 py-2 px-4 rounded-lg ${getLinkStyleForSideBar(link.href)}`}
                        >
                          {link.icon}
                          <span>{link.label}</span>
                        </button>
                      </Link>
                    ))}
                    {isAuthenticated && (
                      <>
                        <Link href="/pages/settings">
                          <button
                            onClick={() => handleNavigation('/pages/settings')}
                            className={`w-full flex items-center space-x-3 py-2 px-4 rounded-lg ${getLinkStyleForSideBar('/pages/settings')}`}
                          >
                            <User size={20} />
                            <span>Settings</span>
                          </button>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 py-2 px-4 text-white bg-red-500 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
                        >
                          <LogOut size={20} />
                          <span>Sign out</span>
                        </button>
                      </>
                    )}
                  </nav>

                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;