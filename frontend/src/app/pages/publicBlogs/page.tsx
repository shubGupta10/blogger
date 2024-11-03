'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_BLOGS } from '@/Graphql/queries/blogQueries'
import { GetBlogsQuery } from '@/gql/graphql'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ArrowRight, Search, Calendar, Grid, List, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

const categories = [
  'technology', 'programming', 'web development', 'mobile development', 'data science',
  'artificial intelligence', 'cloud computing', 'devops', 'cybersecurity', 'sports',
  'health', 'fitness', 'nutrition', 'mental health', 'lifestyle', 'fashion', 'beauty',
  'travel', 'food', 'recipes', 'parenting', 'relationships', 'finance', 'investing',
  'personal finance', 'real estate', 'education', 'science', 'astronomy', 'physics',
  'chemistry', 'biology', 'entertainment', 'movies', 'music', 'tv shows', 'books',
  'gaming', 'art', 'photography', 'politics', 'world news', 'history', 'environment',
  'nature', 'animals', 'business', 'marketing', 'entrepreneurship', 'startups',
  'productivity', 'self improvement', 'spirituality', 'philosophy'
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

interface BlogCardProps {
  blog: Blog
  handleOpenBlogs: (blogId: string) => void
  isLoading: boolean
}

export default function Component() {
  const [viewMode, setViewMode] = useState<'all' | 'categories'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(false)
  const [categoryDisplayMode, setCategoryDisplayMode] = useState<'grid' | 'list'>('grid')
  const router = useRouter()

  const { loading: allBlogsLoading, error: allBlogsError, data: allBlogsData } = useQuery<GetBlogsQuery>(GET_BLOGS)

  const categoryCount = useMemo(() => {
    const counts = {}
    if (allBlogsData?.blogs) {
      allBlogsData.blogs.forEach(blog => {
        counts[blog.blogCategory] = (counts[blog.blogCategory] || 0) + 1
      })
    }
    return counts
  }, [allBlogsData])

  const handleCategoryClick = useCallback((category: string) => {
    if (categoryCount[category]) {
      router.push(`/pages/category/${category}`)
    }
  }, [categoryCount, router])

  const handleOpenBlogs = useCallback(async (BlogId: string) => {
    setIsLoading(true)
    router.push(`/pages/viewBlog/${BlogId}`)
    setIsLoading(false)
  }, [router])

  const filteredBlogs = allBlogsData?.blogs?.filter(blog =>
    (selectedCategory === 'all' || blog.blogCategory === selectedCategory) &&
    (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.blogContent.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const sortedBlogs = [...(filteredBlogs || [])].sort((a, b) => {
    if (sortBy === 'newest') return b._id.localeCompare(a._id)
    if (sortBy === 'oldest') return a._id.localeCompare(b._id)
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    return 0
  })

  if (allBlogsError) return <ErrorState error={allBlogsError.message} />

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400"
        >
          Explore Our Blogs
        </motion.h1>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'all' | 'categories')} className="mb-12">
          <div className="flex justify-center mb-8">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-full bg-white p-1 text-black">
              <TabsTrigger
                value="all"
                className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white"
              >
                All Posts
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Categories
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="categories">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Categories</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCategoryDisplayMode(prev => prev === 'grid' ? 'list' : 'grid')}
                className="flex items-center gap-2"
              >
                {categoryDisplayMode === 'grid' ? (
                  <>
                    <List className="h-4 w-4" />
                    <span>List View</span>
                  </>
                ) : (
                  <>
                    <Grid className="h-4 w-4" />
                    <span>Grid View</span>
                  </>
                )}
              </Button>
            </div>

            {categoryDisplayMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <motion.div
                    key={category}
                    whileHover={{ scale: categoryCount[category] ? 1.05 : 1 }}
                    className={`p-4 rounded-lg ${categoryCount[category]
                      ? 'bg-gray-800 dark:bg-gray-500 cursor-pointer hover:bg-gray-600 text-white dark:hover:bg-gray-400 transition-all duration-200'
                      : 'bg-gray-300 dark:bg-gray-900 text-black dark:text-white'
                      }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <h3 className="font-medium capitalize">
                      {category}
                      {categoryCount[category] && (
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          ({categoryCount[category]})
                        </span>
                      )}
                    </h3>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div className="space-y-2">
                {categories.map((category) => (
                  <motion.div
                    key={category}
                    whileHover={{ scale: categoryCount[category] ? 1.02 : 1 }}
                    className={`p-4 rounded-lg ${categoryCount[category]
                      ? 'bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600'
                      }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium capitalize">{category}</h3>
                      {categoryCount[category] && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {categoryCount[category]} {categoryCount[category] === 1 ? 'post' : 'posts'}
                          </Badge>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="all">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 space-y-4"
            >
              <div className="flex flex-col justify-between sm:flex-row gap-4">
                <Select onValueChange={setSortBy} value={sortBy}>
                  <SelectTrigger className="w-full sm:w-[300px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
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

                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <Input
                    type="text"
                    placeholder="Search blogs..."
                    className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>

            {allBlogsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <BlogCardSkeleton key={index} />
                ))}
              </div>
            ) : sortedBlogs.length === 0 ? (
              <Card className="p-8 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent>
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-2xl text-gray-600 dark:text-gray-300 font-semibold">No blogs found.</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filters.</p>
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
                    <BlogCard key={blog._id} blog={blog} handleOpenBlogs={handleOpenBlogs} isLoading={isLoading} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, handleOpenBlogs, isLoading }) => (
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
>
  <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-200 bg-white dark:bg-black border-gray-200 dark:border-gray-700">
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
      <CardTitle className="line-clamp-2 text-lg hover:text-primary transition-colors duration-200 text-gray-900 dark:text-gray-100">
        {blog.title}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <div
        className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm"
        dangerouslySetInnerHTML={{ __html: blog.blogContent }}
      />
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-5 mb-2">
        <User size={16} className="mr-2" />
        <span className="truncate">
          {blog.user.firstName} {blog.user.lastName}
        </span>
        <Badge
          variant="secondary"
          className="ml-32 bg-gray-800/50 text-white backdrop-blur-sm" 
        >
          {blog.blogCategory}
        </Badge>
      </div>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Calendar size={16} className="mr-2" />
        <span>
          {new Date(parseInt(blog._id.substring(0, 8), 16) * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
    </CardContent>
    <CardFooter>
      <Button
        variant="default"
        onClick={() => handleOpenBlogs(blog._id)}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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


)

const BlogCardSkeleton = () => (
  <Card className="h-full flex flex-col overflow-hidden bg-white dark:bg-black border-gray-200 dark:border-gray-700">
    <div className="relative h-48 overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
    <CardHeader className="flex-none">
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent className="flex-grow">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6" />
      <div className="flex items-center mt-5 mb-2">
        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center">
        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
)

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
    <Card className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-red-500 dark:text-red-400">Unable to load blogs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => window.location.reload()} variant="outline" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          Try Again
        </Button>
      </CardFooter>
    </Card>
  </div>
)