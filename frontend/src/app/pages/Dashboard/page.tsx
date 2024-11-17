'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import UserBlogs from '@/components/UserBlogs'
import { Menu, X, PenSquare, Globe, Settings, BookOpen, Mail, Layout, Sparkles, ArrowUpRight } from 'lucide-react'
import { useMyContext } from '@/context/ContextProvider'
import { GetBlogsByUserDocument, GetBlogsByUserQuery, GetBlogsByUserQueryVariables } from '@/gql/graphql'
import { useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import ChooseCategoryPage from '@/components/ChooseCategoryPage'
import { cn } from '@/lib/utils'

interface NavButtonProps {
  href: string
  children: React.ReactNode
  icon: React.ReactNode
  onClick?: () => void
}

const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    height: 0,
  },
  open: {
    opacity: 1,
    height: 'auto',
  }
}

const NavButton: React.FC<NavButtonProps> = React.memo(({ href, children, icon, onClick }) => (
  <Link href={href} className="w-full md:w-auto">
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        "w-full md:w-auto inline-flex items-center justify-center gap-2",
        "bg-black dark:bg-white text-white dark:text-black",
        "px-4 py-2.5 rounded-xl font-medium text-sm",
        "transition-all duration-300",
        "hover:bg-gray-800 dark:hover:bg-gray-100",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      )}
      onClick={onClick}
    >
      {icon}
      {children}
    </motion.button>
  </Link>
))

NavButton.displayName = 'NavButton'

const Dashboard: React.FC = () => {
  const { user } = useMyContext()
  const userData = user
  const { data } = useQuery<GetBlogsByUserQuery, GetBlogsByUserQueryVariables>(GetBlogsByUserDocument)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const renderStatCard = useCallback((icon: React.ReactNode, title: string, value: string | number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </h3>
    </motion.div>
  ), [])

  const renderRecentBlog = useCallback((blog: any, index: number) => (
    <motion.div
      key={blog._id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl",
        "hover:bg-gray-50 dark:hover:bg-gray-800/50",
        "transition-all duration-300"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">{blog.title}</h3>
      </div>
      <Link
        href={`/pages/blogs/${blog._id}`}
        className="group flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
      >
        View
        <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </motion.div>
  ), [])

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black/95">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.header
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl backdrop-blur-sm mb-6"
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                  <Image
                    src={userData?.profilePicture || '/placeholder.svg'}
                    alt={`${userData?.firstName} ${userData?.lastName}`}
                    width={64}
                    height={64}
                    className="relative rounded-full border-2 border-white dark:border-gray-800 object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Welcome back, {userData?.firstName}!
                    </h1>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" />
                    {userData?.email}
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <NavButton href="/pages/createBlog" icon={<PenSquare className="w-4 h-4" />}>
                  New Blog
                </NavButton>
                <NavButton href="/pages/settings" icon={<Settings className="w-4 h-4" />}>
                  Settings
                </NavButton>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden absolute top-4 right-4"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="sm:hidden border-t border-gray-200 dark:border-gray-800"
              >
                <div className="p-4 space-y-2">
                  <NavButton href="/pages/createBlog" icon={<PenSquare className="w-4 h-4" />}>
                    New Blog
                  </NavButton>
                  <NavButton href="/pages/settings" icon={<Settings className="w-4 h-4" />}>
                    Settings
                  </NavButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Stats Grid */}
        <div className="grid gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <BookOpen className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Blogs</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data?.blogsByUser?.length || 0}
                  </h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Layout className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Latest Blog</p>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                    {userData?.blogs[data?.blogsByUser?.length - 1]?.title || 'No blogs yet'}
                  </h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 sm:col-span-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Globe className="w-6 h-6 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quick Actions</p>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Manage your blog posts</h3>
                  </div>
                </div>
                <Link
                  href="/pages/createBlog"
                  className="inline-flex items-center gap-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                >
                  Create new blog
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          <ChooseCategoryPage />

          {/* Recent Blogs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg backdrop-blur-sm"
          >
            <div className="border-b border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Recent Blogs</h2>
                <Link
                  href="/pages/Dashboard"
                  className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {data?.blogsByUser
                  ?.slice()
                  .reverse()
                  .slice(0, 4)
                  .map((blog, index) => renderRecentBlog(blog, index))}
              </div>
            </div>
          </motion.div>

          {/* User Blogs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg backdrop-blur-sm"
          >
            <div className="p-4">
              <UserBlogs />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard