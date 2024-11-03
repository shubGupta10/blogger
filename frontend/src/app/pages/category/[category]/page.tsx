// app/pages/category/[category]/page.tsx

'use client'

import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BlogsByCategoryQuery, BlogsByCategoryQueryVariables, BlogsByCategoryDocument } from '@/gql/graphql'
import Loader from '@/components/Loader'
import { BlogCard } from '@/components/BlogCard'

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title A-Z" },
]

export default function CategoryPage({ params }: { params: { category: string } }) {
    const {category} = params;
    console.log("My category", category);
    
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { loading, error, data } = useQuery<BlogsByCategoryQuery, BlogsByCategoryQueryVariables>(
    BlogsByCategoryDocument,
    {
      variables: { blogCategory: category },
    }
  )

  const handleOpenBlogs = async (BlogId: string) => {
    setIsLoading(true)
    router.push(`/pages/viewBlog/${BlogId}`)
    setIsLoading(false)
  }

  const filteredBlogs = data?.blogsByCategory?.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.blogContent.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedBlogs = [...(filteredBlogs || [])].sort((a, b) => {
    if (sortBy === 'newest') return b._id.localeCompare(a._id)
    if (sortBy === 'oldest') return a._id.localeCompare(b._id)
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    return 0
  })

  if (loading) return <Loader />
  if (error) return <ErrorState error={error.message} />

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold capitalize"
          >
            {params.category} Blogs
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Select onValueChange={setSortBy} value={sortBy}>
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

            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search blogs..."
                className="pl-10 ring-2 ring-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {sortedBlogs.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-2xl text-gray-600 font-semibold">
                No blogs found in this category.
              </p>
            </CardContent>
          </Card>
        ) : (
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
              <BlogCard
                key={blog._id}
                blog={blog}
                handleOpenBlogs={handleOpenBlogs}
                isLoading={isLoading}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

const ErrorState = ({ error }: { error: string }) => (
  <div className="flex justify-center items-center h-screen bg-gray-50">
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Unable to load blogs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{error}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </CardFooter>
    </Card>
  </div>
)