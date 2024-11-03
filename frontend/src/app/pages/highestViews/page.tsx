'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { GetBlogDocument } from '@/gql/graphql'
import { useQuery } from '@apollo/client'
import { fetchMostViewedPosts } from '@/Firebase/FirebaseViews'
import { Eye, Clock, Bookmark, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface PostData {
  blogId: string
  count: number
}

const BlogPost = ({ blogId, count, rank }: PostData & { rank: number }) => {
  const router = useRouter()
  const { loading, error, data } = useQuery(GetBlogDocument, {
    variables: { blogId },
    fetchPolicy: 'network-only',
  })

  const handleBlog = useCallback(() => {
    router.push(`/pages/viewBlog/${blogId}`)
  }, [router, blogId])

  if (loading) {
    return <BlogPostSkeleton />
  }

  if (error || !data?.blog) return null

  const blog = data.blog

  const formattedDate = blog.createdAt
    ? (() => {
        const postDate = new Date(parseInt(blog.createdAt))
        const now = new Date()
        const difference = now.getTime() - postDate.getTime()
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor(difference / (1000 * 60))
        if (days > 0) return `${days} days ago`
        if (hours > 0) return `${hours} hours ago`
        return `${minutes} minutes ago`
      })()
    : 'Recent'

  return (
    <Card onClick={handleBlog} className="group hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-[360px] h-[200px] rounded-xl overflow-hidden flex-shrink-0">
          {blog.blogImage ? (
            <img 
              src={blog.blogImage} 
              alt={blog.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-500" />
            </div>
          )}
          <Badge variant="secondary" className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 text-white dark:bg-white/80 dark:text-black">
            <TrendingUp className="w-4 h-4 mr-1.5" />
            #{rank}
          </Badge>
        </div>
        <div className="flex-grow py-2">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            {blog.title || "Untitled"}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>{count.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <time dateTime={blog.createdAt}>{formattedDate}</time>
            </div>
          </div>
          {blog.blogCategory && (
            <Badge variant="outline" className="text-blue-700 dark:text-blue-200">
              {blog.blogCategory}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const BlogPostSkeleton = () => (
  <Card>
    <CardContent className="p-4 flex flex-col md:flex-row gap-4">
      <Skeleton className="w-full md:w-[360px] h-[200px] rounded-xl" />
      <div className="flex-grow py-2 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </CardContent>
  </Card>
)

const HighestViews = () => {
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchViewData = async () => {
      try {
        setLoading(true)
        const viewsResponse = await fetchMostViewedPosts(10)
        setPosts(viewsResponse.map(item => ({
          blogId: item.postId,
          count: item.count,
        })))
      } catch (err) {
        console.error('Failed to fetch view data:', err)
        setError('Failed to load post views')
      } finally {
        setLoading(false)
      }
    }

    fetchViewData()
  }, [])

  if (error) {
    return (
      <Card className="max-w-[1200px] mx-auto">
        <CardContent className="p-6">
          <p className="text-red-600 dark:text-red-400 font-medium mb-3">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="destructive"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Trending Posts</CardTitle>
          <CardDescription>The most-viewed content from our community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <BlogPostSkeleton key={i} />
                ))
              : posts.map((post, index) => (
                  <BlogPost 
                    key={post.blogId} 
                    blogId={post.blogId} 
                    count={post.count}
                    rank={index + 1}
                  />
                ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HighestViews