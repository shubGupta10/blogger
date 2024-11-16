
import React from 'react'
import { motion } from 'framer-motion'
import { User, ArrowRight, Calendar } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Blog {
  _id: string
  title: string
  blogImage: string
  blogContent: string
  blogCategory: string
  user: {
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

export const BlogCard: React.FC<BlogCardProps> = ({ blog, handleOpenBlogs, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-200">
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
        <div className="flex items-center text-sm text-gray-500 mt-5 mb-2">
          <User size={16} className="mr-2" />
          <span className="truncate">
            {blog.user.firstName} {blog.user.lastName}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={16} className="mr-2" />
          <span>
            {new Date(parseInt(blog._id.substring(0, 8), 16) * 1000).toLocaleDateString('en-US', {
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
)