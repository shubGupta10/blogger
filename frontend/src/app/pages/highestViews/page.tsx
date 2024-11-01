'use client'

import React, { useEffect, useState } from 'react';
import { GetBlogDocument } from '@/gql/graphql';
import { useQuery } from '@apollo/client';
import { fetchMostViewedPosts } from '@/Firebase/FirebaseViews';
import { Eye, Clock, Bookmark, TrendingUp } from 'lucide-react';

interface PostData {
  blogId: string;
  count: number;
}

const BlogPost = ({ blogId, count, rank }: PostData & { rank: number }) => {
  const { loading, error, data } = useQuery(GetBlogDocument, {
    variables: { blogId },
    fetchPolicy: 'network-only',
  });


  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-black dark:border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}

  

  if (error) return null;

  const blog = data?.blog;
  if (!blog) return null;

  const formattedDate = blog.createdAt
    ? (() => {
        const postDate = new Date(parseInt(blog.createdAt));
        const now = new Date();
        const difference = now.getTime() - postDate.getTime(); 
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(difference / (1000 * 60));
        if (days > 0) return `${days} days ago`;
        if (hours > 0) return `${hours} hours ago`;
        return `${minutes} minutes ago`;
      })()
    : 'Recent';

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="group flex flex-col md:flex-row gap-4 p-4 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer">
      {/* Thumbnail Section */}
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

        {/* Duration/Rank Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 text-white dark:bg-white/80 dark:text-black text-sm font-medium rounded-lg flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4" />
          #{rank}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow py-2">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
              {blog.title || "Untitled"}
            </h2>
            
            {/* View count and date */}
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

            {/* Category */}
            {blog.blogCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                {blog.blogCategory}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HighestViews = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchViewData = async () => {
      try {
        setLoading(true);
        const viewsResponse = await fetchMostViewedPosts(10);
        setPosts(viewsResponse.map(item => ({
          blogId: item.postId,
          count: item.count,
        })));
      } catch (err) {
        console.error('Failed to fetch view data:', err);
        setError('Failed to load post views');
      } finally {
        setLoading(false);
      }
    };

    fetchViewData();
  }, []);

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900 border border-red-100 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-200 font-medium mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">Top 10 Trending Posts</h1>
          <p className="text-gray-600 text-lg md:text-xl dark:text-gray-300">The most-viewed content from our community</p>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-2 divide-y divide-gray-900 dark:divide-gray-600">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <BlogPost 
              key={i} 
              blogId="" 
              count={0} 
              rank={i + 1}
            />
          ))
        ) : (
          posts.map((post, index) => (
            <BlogPost 
              key={post.blogId} 
              blogId={post.blogId} 
              count={post.count}
              rank={index + 1}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HighestViews;
