'use client'

import { useQuery } from '@apollo/client'
import Image from 'next/image'
import Link from 'next/link'
import { GET_BLOGS_BY_CATEGORY } from '@/Graphql/queries/blogQueries'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from 'react'
import { ThumbsUp, Calendar } from 'lucide-react'

interface Blog {
    _id: string
    title: string
    blogImage: string
    createdAt: string
    likeCount: number
    views: number
    user: {
        firstName: string
        lastName: string
        profilePicture: string
    }
}

interface FetchMoreBlogsProps {
    category: string
}

export default function FetchMoreBlogs({ category }: FetchMoreBlogsProps) {
    const { data, loading, error } = useQuery(GET_BLOGS_BY_CATEGORY, {
        variables: { blogCategory: category },
    })
    const [randomizedBlogs, setRandomizedBlogs] = useState<Blog[]>([])

    useEffect(() => {
        if (data?.blogsByCategory) {
            const shuffled = [...data.blogsByCategory].sort(() => Math.random() - 0.5)
            setRandomizedBlogs(shuffled)
        }
    }, [category, data, loading, error])
    

    if (loading) return <LoadingSkeleton />
    if (error) return <ErrorMessage error={error} />

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#000000] text-white relative z-10">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">More blogs related to you</h2>
                {randomizedBlogs.length === 0 ? (
                    <NoRelatedBlogs category={category} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {randomizedBlogs.map((blog) => blog && (
                            <Card key={blog._id} className="bg-gray-900 border-gray-800 overflow-hidden transition-transform duration-300 hover:scale-105">
                                <Link href={`/pages/viewBlog/${blog._id}`} className="block">
                                    <div className="relative h-48">
                                        <Image
                                            src={blog.blogImage}
                                            alt={blog.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-t-lg"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="text-xl font-semibold text-white line-clamp-2 mb-2">{blog.title}</h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-800 font-semibold text-sm">
                                                {blog?.user?.firstName?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <span>{blog.user?.firstName}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-4 py-3 bg-[#111827] flex justify-between items-center text-sm text-gray-400">
                                        <span className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {new Date(parseInt(blog._id.substring(0, 8), 16) * 1000).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </span>
                                        <span className="flex items-center space-x-2">
                                            <span className="flex items-center space-x-1">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span className='text-white'>{blog.likeCount || 0}</span>
                                            </span>
                                        </span>
                                    </CardFooter>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

function LoadingSkeleton() {
    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-[#000000] relative z-10">
            <div className="max-w-7xl mx-auto">
                <Skeleton className="h-10 w-64 mb-8 bg-gray-800" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="bg-gray-900 border-gray-800 overflow-hidden">
                            <Skeleton className="w-full h-48 bg-gray-800" />
                            <CardContent className="p-4">
                                <Skeleton className="h-6 w-3/4 mb-2 bg-gray-800" />
                                <div className="flex items-center space-x-2">
                                    <Skeleton className="w-6 h-6 rounded-full bg-gray-800" />
                                    <Skeleton className="h-4 w-24 bg-gray-800" />
                                </div>
                            </CardContent>
                            <CardFooter className="px-4 py-3 bg-gray-800 flex justify-between items-center">
                                <Skeleton className="h-4 w-24 bg-gray-700" />
                                <div className="flex space-x-2">
                                    <Skeleton className="h-4 w-16 bg-gray-700" />
                                    <Skeleton className="h-4 w-16 bg-gray-700" />
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

function NoRelatedBlogs({ category }: { category: string }) {
    return (
        <div className="text-center py-8 bg-gray-900 rounded-lg">
            <p className="text-gray-300 mb-4">
                No related blogs found for category: <span className="font-semibold">{category}</span>
            </p>
            <p className="text-gray-400">
                Try exploring other categories or check back later for new content!
            </p>
        </div>
    )
}

function ErrorMessage({ error }: { error: Error }) {
    return (
        <div className="text-center py-8 bg-red-900 rounded-lg relative z-10">
            <h3 className="text-xl font-semibold text-red-300 mb-2">Error loading related blogs</h3>
            <p className="text-red-400">{error.message}</p>
            <p className="mt-4 text-gray-300">Please try again later or contact support if the problem persists.</p>
        </div>
    )
}