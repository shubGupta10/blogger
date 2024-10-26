'use client'

import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_BLOGS_BY_USER } from '@/Graphql/queries/blogQueries'
import { Trash2, Edit3, Eye, Search, Loader2, Plus, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { DeleteBlogDocument, DeleteBlogMutation, DeleteBlogMutationVariables } from '@/gql/graphql'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Blog {
  _id: string
  title: string
  blogImage: string
  blogContent: string
  blogCategory: string
  createdAt: string
}

export default function UserBlogs() {
  const { data, loading, error } = useQuery(GET_BLOGS_BY_USER)
  const [deleteBlog, { loading: deleteLoading }] = useMutation<DeleteBlogMutation, DeleteBlogMutationVariables>(
    DeleteBlogDocument,
    {
      refetchQueries: [{ query: GET_BLOGS_BY_USER }],
    }
  )
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('newest')

  const handleDelete = async (blogId: string) => {
    try {
      setDeletingBlogId(blogId)
      await deleteBlog({ variables: { blogId } })
      toast.success('Blog deleted successfully')
    } catch (error: any) {
      toast.error('Failed to delete blog')
    } finally {
      setDeletingBlogId(null)
    }
  }

  const blogs = data?.blogsByUser || []


  const filteredBlogs = blogs.filter((blog: Blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.blogContent.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a: Blog, b: Blog) => {
    if (sortBy === 'newest') return parseInt(b.createdAt) - parseInt(a.createdAt)
    if (sortBy === 'oldest') return parseInt(a.createdAt) - parseInt(b.createdAt)
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    return 0
  })

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground font-medium">Loading your blogs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-destructive">Unable to load blogs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error.message}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-primary">My Blogs</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage your collection of {blogs.length} blog {blogs.length === 1 ? 'post' : 'posts'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search by title or content..."
                  className="pl-10 bg-white dark:bg-black dark:border-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-black dark:border-gray-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => router.push('/pages/createBlog')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Blog
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredBlogs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-12 space-y-4"
                >
                  <Search className="w-12 h-12 text-muted-foreground" />
                  <p className="text-xl text-muted-foreground">No blogs found matching your search.</p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm('')}
                      className="mt-2"
                    >
                      Clear Search
                    </Button>
                  )}
                </motion.div>
              ) : (
                filteredBlogs.map((blog: Blog) => (
                  <motion.div
                    key={blog._id}
                    layoutId={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden group">
                      <div className="relative h-48 overflow-hidden group">
                        <img
                          src={blog.blogImage}
                          alt={blog.title}
                          className="w-full h-full object-contain transition-transform duration-300 transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardHeader className="flex-none">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="line-clamp-2 text-lg">{blog.title}</CardTitle>
                          <Badge variant="secondary" className="flex-shrink-0">
                            {blog.blogCategory}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div
                          className="text-muted-foreground line-clamp-3 text-sm"
                          dangerouslySetInnerHTML={{ __html: blog.blogContent }}
                        />
                        <p className="mt-4 text-sm text-muted-foreground">
                          {new Date(parseInt(blog.createdAt)).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </CardContent>
                      <CardFooter className="grid md:grid-cols-3 gap-2 grid-cols-1">
                        <Button
                          variant="secondary"
                          className="w-full bg-black text-white dark:bg-white dark:text-black"
                          onClick={() => router.push(`/pages/blogs/${blog._id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" /> View
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full bg-black text-white dark:bg-white dark:text-black"
                          onClick={() => router.push(`/pages/EditBlogs/${blog._id}`)}
                        >
                          <Edit3 className="w-4 h-4 mr-2" /> Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="secondary" className="w-full bg-black text-white dark:bg-white dark:text-black">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(blog._id)}
                                disabled={deleteLoading && deletingBlogId === blog._id}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                {deleteLoading && deletingBlogId === blog._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <Trash2 className="w-4 h-4 mr-2" />
                                )}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}