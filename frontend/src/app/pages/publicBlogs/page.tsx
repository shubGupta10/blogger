'use client'

import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_BLOGS } from '@/Graphql/queries/blogQueries'
import { GetBlogsQuery, BlogsByCategoryQuery, BlogsByCategoryQueryVariables, BlogsByCategoryDocument } from '@/gql/graphql'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ArrowRight, Search, AlertCircle, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Loader from '@/components/Loader'

const categories = [
  { value: "all", label: "All Categories" },
  { value: "technology", label: "Technology" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "entertainment", label: "Entertainment" },
  { value: "sports", label: "Sports" },
]

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title A-Z" },
]

interface Blog {
  __typename?: "Blog"
  _id: string
  title: string
  blogImage: string
  blogContent: string
  blogCategory: string
  user: {
    __typename?: "User"
    _id: string
    firstName: string
    lastName?: string | null
  }
}

export default function PublicBlogs() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
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
      <Loader />
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Unable to load blogs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error.message}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
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

  const sortedBlogs = [...(filteredBlogs || [])].sort((a: Blog, b: Blog) => {
    if (sortBy === 'newest') return b._id.localeCompare(a._id)
    if (sortBy === 'oldest') return a._id.localeCompare(b._id)
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    return 0
  })

  return (
    <div className="min-h-screen  py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-bold  mb-12 text-center"
        >
          Explore Our Blogs
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:space-x-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Select onValueChange={handleCategoryChange} value={selectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handleSortChange} value={sortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search blogs..."
              className="pl-10  ring-2 ring-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {sortedBlogs.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-2xl text-gray-600 font-semibold">No blogs found.</p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {sortedBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      {blog.blogImage && (
                        <img
                          src={blog.blogImage}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <CardHeader className="flex-none">
                      <CardTitle className="line-clamp-2 text-lg">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div
                        className="text-muted-foreground line-clamp-3 text-sm"
                        dangerouslySetInnerHTML={{ __html: blog.blogContent }}
                      />
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <User size={16} className="mr-2" />
                        <span className="truncate">
                          {blog.user.firstName} {blog.user.lastName}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        <span>
                          {new Date(blog._id.substring(0, 8)).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Badge variant="secondary">{blog.blogCategory}</Badge>
                      <Button
                        variant="default"
                        onClick={() => handleOpenBlogs(blog._id)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <motion.div
                            className="w-5 h-5 border-t-2 border-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
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