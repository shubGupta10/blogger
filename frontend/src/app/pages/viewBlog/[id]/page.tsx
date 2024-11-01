'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries';
import { GetBlogQuery, GetBlogQueryVariables } from '@/gql/graphql';
import { ChevronDown, Share2Icon, MessageCircle, Calendar, User, ArrowLeft } from 'lucide-react';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { addComment, fetchCommentsByPostId } from '@/Firebase/FirebaseComments';
import { FETCH_USER_BY_ID } from '@/Graphql/queries/userQueries';
import { useMyContext } from '@/context/ContextProvider';
import { Button } from '@/components/ui/button';
import ViewTracker from '@/components/ViewTracker';
import Markdown from 'react-markdown'

interface User {
  userId: string;
  firstName: string;
  lastName?: string;
  email: string;
  profilePicture?: string;
}

interface Comment {
  id: string;
  userData: User;
  content: string;
  createdAt: Date;
}

const BlogDetails = ({ params }: { params: { id: string } }) => {
  const { user: CurrentUser } = useMyContext();
  const { id } = params;
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  const { data: blogData, loading: blogLoading, error: blogError } = useQuery<GetBlogQuery, GetBlogQueryVariables>(GET_SINGLEBLOG, {
    variables: { blogId: id },
  });

  const { data: userData, loading: userLoading, error: userError } = useQuery(FETCH_USER_BY_ID, {
    variables: { userId: blogData?.blog?.user._id },
    skip: !blogData?.blog?.user._id,
  });

  useEffect(() => {
    const loadComments = async () => {
      const commentsData = await fetchCommentsByPostId(id);
      setComments(commentsData);
    };
    loadComments();
  }, [id]);

  if (blogLoading || userLoading) return (
    <div className="flex justify-center items-center h-screen bg-black">
      <Loader />
    </div>
  );

  if (blogError || userError) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-red-500 p-6 bg-black min-h-screen flex items-center justify-center"
    >
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Error</h2>
        <p>{blogError?.message || userError?.message}</p>
      </div>
    </motion.div>
  );

  const blog = blogData?.blog;
  const user = userData?.fetchUserByID;

  const handleOpenPublicProfile = (blog: any) => {
    router.push(`/pages/publicUserProfile/${blog._id}`);
  };

  const handleSubmit = () => {
    router.push(`/pages/SummarisePage/${blog?._id}`);
  };

  if (!blog || !user) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center p-6 bg-black min-h-screen flex items-center justify-center text-white"
    >
      <h2 className="text-3xl font-bold">Blog or User not found</h2>
    </motion.div>
  );

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim() && CurrentUser) {
      const userDataForComment: User = {
        userId: CurrentUser._id,
        firstName: CurrentUser.firstName,
        lastName: CurrentUser.lastName || '',
        email: CurrentUser.email,
        profilePicture: CurrentUser.profilePicture,
      };

      await addComment(id, userDataForComment, newComment.trim());
      setNewComment('');

      const updatedComments = await fetchCommentsByPostId(id);
      setComments(updatedComments);

      toast.success("Comment added successfully!");
    } else {
      toast.error("Please log in to comment.");
    }
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  };

  const ShareBlog = () => {
    const CurrentUrl = window.location.href;
    navigator.clipboard.writeText(CurrentUrl).then(() => {
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 5000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy link');
    });
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => router.back()} className="flex items-center text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-6">
              <ViewTracker userId={CurrentUser._id} postId={id} />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCommentSectionOpen(!isCommentSectionOpen)}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <MessageCircle className="h-5 w-5 mr-1" />
                <span>{comments.length}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={ShareBlog}
                className="text-gray-300 hover:text-white transition-colors relative"
              >
                <Share2Icon className="h-5 w-5" />
                <AnimatePresence>
                  {isCopied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                    >
                      Copied!
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <header className="relative pt-20 pb-40 flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src={blog.blogImage} alt={blog.title} className="w-full h-full object-cover filter blur-sm opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
          <motion.h1
            {...fadeIn}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            {blog.title}
          </motion.h1>
          <motion.div
            {...fadeIn}
            className="flex items-center space-x-4 mb-8"
          >
            <img
              src={user.profilePicture || '/api/placeholder/100/100'}
              alt={user.firstName}
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
            />
            <div className="text-left">
              <p className="font-semibold text-xl text-blue-400">{`${user.firstName} ${user.lastName}`}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </motion.div>
          <motion.div
            {...fadeIn}
            className="flex items-center space-x-6 text-sm text-gray-400"
          >
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(parseInt(blog.createdAt)).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <ViewTracker userId={CurrentUser._id} postId={id} />
            </span>
          </motion.div>
          <div className="mt-10 flex justify-center">
            <Button
              onClick={handleSubmit}
              className='bg-gradient-to-r from-gray-800 to-gray-500 hover:from-gray-600 hover:to-gray-700 text-white rounded-full px-10 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
            >
              Summarise Blog
            </Button>
          </div>
        </div>

      </header>




      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          {...fadeIn}
          className="prose prose-lg prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{
            __html: isContentExpanded
              ? blog.blogContent
              : blog.blogContent.slice(0, 500) + '...'
          }}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsContentExpanded(!isContentExpanded)}
          className="flex items-center justify-center w-full py-4 bg-white text-black rounded-lg font-semibold transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isContentExpanded ? 'Read Less' : 'Read More'}
          <ChevronDown className={`ml-2 transform transition-transform duration-300 ${isContentExpanded ? 'rotate-180' : ''}`} />
        </motion.button>



        <AnimatePresence>
          {isCommentSectionOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-20"
            >
              <h2 className="text-3xl font-bold mb-10 text-center">Comments</h2>
              <form onSubmit={handleCommentSubmit} className="mb-12">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-4 rounded-lg bg-gray-900 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-300"
                  rows={4}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-8 py-3 bg-white text-black rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Post Comment
                </motion.button>
              </form>
              <div className="space-y-8">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    className="bg-gray-900 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={comment.userData?.profilePicture || `/api/placeholder/40/40`}
                        alt={`${comment.userData?.firstName} ${comment.userData?.lastName}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg text-blue-400">{`${comment.userData?.firstName} ${comment.userData?.lastName}`}</h3>
                          <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default BlogDetails;