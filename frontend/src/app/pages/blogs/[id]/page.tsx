'use client'

import React, { useState, useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { motion, AnimatePresence } from 'framer-motion'
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries'
import { GetBlogQuery, GetBlogQueryVariables } from '@/gql/graphql'
import { ChevronDown, Calendar, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ViewTracker from '@/components/ViewTracker'
import { useMyContext } from '@/context/ContextProvider'
import LikesAndUnlike from '@/components/LikesAndUnlike'

const BlogDetails = ({ params }: { params: { id: string } }) => {
  const { user } = useMyContext()
  const { id } = params
  const router = useRouter()

  const [isContentExpanded, setIsContentExpanded] = useState(false)

  const { data, loading, error } = useQuery<GetBlogQuery, GetBlogQueryVariables>(GET_SINGLEBLOG, {
    variables: { blogId: id },
  })

  const handleSubmit = useCallback(() => {
    router.push(`/pages/SummarisePage/${id}`)
  }, [router, id])

  const handleOpenProfile = useCallback((userID: string) => {
    router.push(`/pages/userProfile/${userID}`)
  }, [router])

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error.message} />

  const blog = data?.blog
  if (!blog) return <NotFoundState />

  return (
    <div className="min-h-screen bg-black text-white">
      <BlogHeader blog={blog} handleOpenProfile={handleOpenProfile} />
      <BlogActions user={user} id={id} handleSubmit={handleSubmit} />
      <BlogContent blog={blog} isContentExpanded={isContentExpanded} setIsContentExpanded={setIsContentExpanded} />
    </div>
  )
}

const LoadingState = () => (
  <div className="flex justify-center items-center h-screen bg-black">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
  </div>
)

const ErrorState = ({ error }: { error: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center text-red-500 p-6 bg-black min-h-screen flex items-center justify-center"
  >
    <Card className="bg-white p-8 rounded-lg shadow-lg">
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error}</p>
      </CardContent>
    </Card>
  </motion.div>
)

const NotFoundState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center p-6 bg-black min-h-screen flex items-center justify-center text-white"
  >
    <h2 className="text-3xl font-bold">Blog not found</h2>
  </motion.div>
)

const BlogHeader = ({ blog, handleOpenProfile }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="relative h-screen"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
    <img src={blog.blogImage} alt={blog.title} className="w-full h-full object-cover" />
    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-6xl font-bold mb-4"
      >
        {blog.title}
      </motion.h1>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center cursor-pointer mt-8 space-x-4"
        onClick={() => handleOpenProfile(blog.user?._id)}
      >
        <Avatar className="w-12 h-12 border-2 border-white">
          <AvatarImage src={blog.user?.profilePicture || '/api/placeholder/100/100'} alt={blog.user?.firstName} />
          <AvatarFallback>{blog.user?.firstName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{`${blog.user?.firstName} ${blog.user?.lastName}`}</p>
          <p className="text-sm text-gray-300">{blog.user?.email}</p>
        </div>
      </motion.div>
    </div>
  </motion.div>
)

const BlogActions = ({ user, id, handleSubmit }) => (
  <div className='flex justify-end mr-8 mt-4'>
    <div className='flex mr-10 font-extrabold rounded-full text-xl'>
      <ViewTracker userId={user._id} postId={id} />
    </div>
    <div className='flex mr-10 font-extrabold rounded-full text-xl'>
    <LikesAndUnlike userId={user._id} blogId={id} initialLikeCount={0} />
    </div>
    <Button
      onClick={handleSubmit}
      className='bg-white hover:bg-gray-200 text-black rounded-full transition-colors duration-300'
    >
      Summarise Blog
    </Button>
  </div>
)

const BlogContent = ({ blog, isContentExpanded, setIsContentExpanded }) => (
  <div className="max-w-4xl mx-auto px-6 py-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="flex items-center space-x-4 mb-8 mt-4 text-gray-400"
    >
      <Calendar size={20} />
      <span>{new Date(parseInt(blog.createdAt)).toLocaleDateString()}</span>
      <User size={20} />
      <span>{`${blog.user?.firstName} ${blog.user?.lastName}`}</span>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className={`prose prose-lg prose-invert max-w-none mb-8 ${isContentExpanded ? '' : 'line-clamp-5'}`}
      dangerouslySetInnerHTML={{ __html: blog.blogContent }}
    />

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsContentExpanded(!isContentExpanded)}
      className="flex items-center justify-center w-full py-4 bg-white text-black rounded-lg font-semibold mt-4 transition-colors duration-300 hover:bg-gray-200"
    >
      {isContentExpanded ? 'Read Less' : 'Read More'}
      <ChevronDown className={`ml-2 transform transition-transform duration-300 ${isContentExpanded ? 'rotate-180' : ''}`} />
    </motion.button>
  </div>
)

export default BlogDetails