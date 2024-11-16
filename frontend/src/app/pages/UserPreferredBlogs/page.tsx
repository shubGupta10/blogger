'use client'

import React from 'react';
import { useMyContext } from '@/context/ContextProvider';
import { GET_BLOGS_BY_CATEGORIES } from '@/Graphql/queries/blogQueries';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Clock, ArrowRight, StarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const BlogsByPreference = () => {
    const router = useRouter();
    const { user } = useMyContext();
    const multipleCategories = user?.recommendedCategory || [];

    const { data, loading, error } = useQuery(GET_BLOGS_BY_CATEGORIES, {
        variables: { blogCategories: multipleCategories },
    });

    // Loading State with Shimmer Effect
    if (loading) {
        return (
            <div className="container max-w-7xl mx-auto px-4 py-12">
                <Skeleton className="h-12 w-3/4 max-w-2xl mx-auto mb-12 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="overflow-hidden border border-border/50 animate-pulse">
                            <div className="relative aspect-[16/9]">
                                <Skeleton className="w-full h-full" />
                            </div>
                            <CardHeader className="space-y-4">
                                <Skeleton className="h-8 w-3/4" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                            <CardFooter className="flex justify-between items-center pt-6 border-t border-border">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="w-5 h-5" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // New User or Error State with Enhanced Animation
    if (error || !multipleCategories.length) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center min-h-[100vh]"
            >
                <div className="text-center space-y-6 px-4 max-w-2xl mx-auto">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="h-32 w-32 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                        <StarIcon className="h-16 w-16 text-primary animate-pulse" />
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-bold text-foreground"
                    >
                        Welcome to Your Reading Journey!
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-muted-foreground"
                    >
                        {error ? "We encountered an issue loading your preferences." : 
                        "Let's personalize your reading experience by selecting your favorite topics."}
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="pt-6"
                    >
                        <Button 
                            size="lg"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 text-lg transform transition-all duration-300 hover:scale-105"
                            onClick={() => router.push('/pages/Dashboard')}
                        >
                            Set Your Preferences
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return (
        <ScrollArea className="h-full">
            <div className="container max-w-7xl mx-auto px-4 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 mb-16"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                        Your Curated Reading List
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Discover stories tailored to your interests
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data?.blogsByCategories?.map((blog: any, index: number) => (
                        <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={`/pages/viewBlog/${blog._id}`}
                                className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl block"
                            >
                                <Card className="group h-full overflow-hidden border border-border/50 rounded-xl transition-all duration-300 hover:border-primary/50 hover:shadow-lg dark:hover:shadow-primary/5 hover:scale-[1.02]">
                                    <div className="relative overflow-hidden aspect-[16/9]">
                                        <img
                                            src={blog.blogImage}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                                        <Badge
                                            variant="secondary"
                                            className="absolute top-4 right-4 backdrop-blur-md bg-background/50"
                                        >
                                            {blog.blogCategory}
                                        </Badge>
                                    </div>

                                    <CardHeader className="relative space-y-4">
                                        <CardTitle className="text-2xl font-bold line-clamp-2 transition-colors group-hover:text-primary/90">
                                            {blog.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>5 min read</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4 text-primary" />
                                                <span>{blog.likeCount} likes</span>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div
                                            className="text-muted-foreground line-clamp-3"
                                            dangerouslySetInnerHTML={{ __html: blog.blogContent }}
                                        />
                                    </CardContent>

                                    <CardFooter className="flex justify-between items-center pt-6 border-t border-border">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {blog.user.firstName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium">
                                                {blog.user.firstName} {blog.user.lastName}
                                            </span>
                                        </div>
                                        <div className="p-2 rounded-full transition-all duration-300 group-hover:bg-primary/10">
                                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </ScrollArea>
    );
};

export default BlogsByPreference;