'use client'

import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Calendar, ArrowRight, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BlogsByCategoryDocument, BlogsByCategoryQuery, BlogsByCategoryQueryVariables } from '@/gql/graphql'

const categories = [
  { value: "all", label: "All Categories" },
  { value: "technology", label: "Technology" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "entertainment", label: "Entertainment" },
  { value: "sports", label: "Sports" },
]


export default function BlogCategories() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const { loading, error, data } = useQuery<BlogsByCategoryQuery, BlogsByCategoryQueryVariables>(
    BlogsByCategoryDocument,
    {
      variables: { blogCategory: selectedCategory },
      skip: !selectedCategory,
    }
  )

  const handleCategoryChange = (category: string) => {
    if (categories.some(cat => cat.value === category)) {
      setSelectedCategory(category);
    }
  };

  const handleOpenBlog = (blogId: string) => {
    router.push(`/pages/viewBlog/${blogId}`)
  }

  const filteredBlogs = data?.blogsByCategory.filter((blog) =>
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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8">Explore Our Blogs</h1>
        
        <div className="mb-8 max-w-md mx-auto">
          <Select onValueChange={handleCategoryChange} value={selectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search blogs..."
              className="pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center mt-10 p-4 bg-white rounded-lg shadow">
            Error: {error.message}
          </div>
        )}

        {!loading && !error && filteredBlogs && filteredBlogs.length === 0 && (
          <p className="text-center text-gray-500 text-xl bg-white p-6 rounded-lg shadow">
            No blogs found in this category.
          </p>
        )}

        {!loading && !error && filteredBlogs && filteredBlogs.length > 0 && (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlogs.map((blog) => (
                <motion.div key={blog._id} variants={itemVariants}>
                  <Card className="overflow-hidden">
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
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleOpenBlog(blog._id)}
                      >
                        Read More
                        <ArrowRight size={16} className="ml-2" />
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