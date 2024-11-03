'use client'

import React, { useEffect, useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { GetBlogQuery, GetBlogQueryVariables, LikeBlogDocument, LikeBlogMutation, LikeBlogMutationVariables } from '@/gql/graphql'
import { UnlikeBlogDocument, UnlikeBlogMutation, UnlikeBlogMutationVariables } from '@/gql/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries'

export default function LikesAndUnlike({ blogId, userId, initialLikeCount = 0 }: { blogId: string, userId: string, initialLikeCount: number }) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const { data: blogData } = useQuery<GetBlogQuery, GetBlogQueryVariables>(GET_SINGLEBLOG, {
    variables: { blogId }
  })

  useEffect(() => {
    if (blogData?.blog) {
      setLikeCount(blogData.blog.likeCount)
      const likedByUser = blogData.blog.likedBy?.some(user => user._id === userId)
      setIsLiked(!!likedByUser)
    }
  }, [blogData, userId])

  const [likeBlog, { loading: likeLoading, error: likeError }] = 
    useMutation<LikeBlogMutation, LikeBlogMutationVariables>(LikeBlogDocument, {
      onCompleted: (data) => {
        setLikeCount(data.likeBlog.likeCount)
        setIsLiked(true)
        setIsDisliked(false)
      }
    })

  const [unlikeBlog, { loading: unlikeLoading, error: unlikeError }] = 
    useMutation<UnlikeBlogMutation, UnlikeBlogMutationVariables>(UnlikeBlogDocument, {
      onCompleted: (data) => {
        setLikeCount(data.unlikeBlog.likeCount)
        setIsLiked(false)
        setIsDisliked(true)
      }
    })

  const handleLike = async () => {
    if (!isLiked) {
      try {
        await likeBlog({ 
          variables: { blogId },
          update: (cache) => {
            cache.modify({
              fields: {
                blogs(existingBlogs = []) {
                  return [...existingBlogs]
                }
              }
            })
          }
        })
      } catch (error) {
        console.error("Failed to like Blog:", error)
      }
    }
  }

  const handleDislike = async () => {
    if (isLiked) { 
      try {
        await unlikeBlog({ 
          variables: { blogId },
          update: (cache) => {
            cache.modify({
              fields: {
                blogs(existingBlogs = []) {
                  return [...existingBlogs]
                }
              }
            })
          }
        })
      } catch (error) {
        console.error("Failed to unlike Blog:", error)
      }
    }
  }

  if (likeLoading || unlikeLoading) {
    return (
      <div className="flex items-center justify-center p-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-sm bg-transparent shadow-none">
      <CardContent className="p-0">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isLiked ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 ${isLiked ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-primary'}`}
                  onClick={handleLike}
                >
                  <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-primary-foreground' : 'fill-none'}`} />
                  <span className="font-semibold">{likeCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isLiked ? 'You liked this' : 'Like this blog'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isDisliked ? "destructive" : "ghost"}
                  size="sm"
                  className={`flex items-center ${isDisliked ? 'bg-destructive text-destructive-foreground' : 'text-muted-foreground hover:text-destructive'}`}
                  onClick={handleDislike}
                >
                  <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-destructive-foreground' : 'fill-none'}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isDisliked ? 'You disliked this' : 'Dislike this blog'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {(likeError || unlikeError) && (
          <Alert variant="destructive" className="mt-2 p-2 text-sm">
            <AlertDescription>
              {likeError ? `Failed to like: ${likeError.message}` : `Failed to unlike: ${unlikeError.message}`}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}