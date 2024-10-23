'use client'

import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_BLOGS } from '@/Graphql/queries/blogQueries'
import { GetBlogsQuery, BlogsByCategoryDocument, BlogsByCategoryQuery, BlogsByCategoryQueryVariables } from '@/gql/graphql'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Calendar, ArrowRight, Search, AlertCircle } from 'lucide-react'
import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const categories = [
  { value: "technology", label: "Technology" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "entertainment", label: "Entertainment" },
  { value: "sports", label: "Sports" },
]

export default function PublicBlogs() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { loading: allBlogsLoading, error: allBlogsError, data: allBlogsData, refetch: refetchAllBlogs } = useQuery<GetBlogsQuery>(GET_BLOGS)
  const { loading: categoryBlogsLoading, error: categoryBlogsError, data: categoryBlogsData, refetch: refetchCategoryBlogs } = useQuery<BlogsByCategoryQuery, BlogsByCategoryQueryVariables>(
    BlogsByCategoryDocument,
    {
      variables: { blogCategory: selectedCategory },
      skip: selectedCategory === 'all',
    }
  )

  useEffect(() => {
    if (selectedCategory === 'all') {
      refetchAllBlogs()
    } else {
      refetchCategoryBlogs()
    }
  }, [selectedCategory, refetchAllBlogs, refetchCategoryBlogs])

  const loading = allBlogsLoading || categoryBlogsLoading
  const error = allBlogsError || categoryBlogsError

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
          <div className="mt-4">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </Alert>
      </div>
    )
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleOpenBlogs = async (BlogId: string) => {
    setIsLoading(true)
    router.push(`/pages/viewBlog/${BlogId}`)
    setIsLoading(false)
  }

  const blogs = selectedCategory === 'all' ? allBlogsData?.blogs : categoryBlogsData?.blogsByCategory

  const filteredBlogs = blogs?.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.blogContent.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-8 text-center">
          Explore Our Blogs
        </h1>

        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Select onValueChange={handleCategoryChange} value={selectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search blogs..."
              className="pl-10 pr-4 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredBlogs && filteredBlogs.length === 0 ? (
          <Card className="p-6">
            <CardContent className="text-center text-gray-500 text-xl">
              No blogs found.
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlogs?.map((blog) => (
                <motion.div key={blog._id} variants={itemVariants}>
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      {blog.blogImage && (
                        <img
                          src={blog.blogImage}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                      <CardHeader className="absolute bottom-0 left-0 text-white">
                        <CardTitle className="text-xl font-bold truncate">{blog.title}</CardTitle>
                      </CardHeader>
                    </div>
                    <CardContent className="p-6">
                      <p
                        className="text-gray-600 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: blog.blogContent }}
                      />
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <User size={16} className="mr-2" />
                        <span className="mr-4 truncate">
                          {blog.user.firstName} {blog.user.lastName ?? ''}
                        </span>
                        <Calendar size={16} className="mr-2" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full flex items-center justify-center"
                        onClick={() => handleOpenBlogs(blog._id)}
                      >
                        {isLoading ? (
                          <Loader />
                        ) : (
                          <>
                            Read More
                            <ArrowRight size={16} className="ml-2" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}