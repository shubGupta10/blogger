'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries';
import { GetBlogQuery, GetBlogQueryVariables } from '@/gql/graphql';
import { ChevronDown, Share2, MessageCircle, Calendar, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { addComment, fetchCommentsByPostId } from '@/Firebase/FirebaseComments';
import { FETCH_USER_BY_ID } from '@/Graphql/queries/userQueries';
import { useMyContext } from '@/context/ContextProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import ViewTracker from '@/components/ViewTracker';
import LikesAndUnlike from '@/components/LikesAndUnlike';
import Loader from '@/components/Loader';

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

  if (blogLoading || userLoading) return <LoadingState />;
  if (blogError || userError) return <ErrorState error={blogError?.message || userError?.message} />;

  const blog = blogData?.blog;
  const user = userData?.fetchUserByID;

  if (!blog || !user) return <NotFoundState />;

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
      <Navbar router={router} isCommentSectionOpen={isCommentSectionOpen} setIsCommentSectionOpen={setIsCommentSectionOpen} commentsCount={comments.length} ShareBlog={ShareBlog} isCopied={isCopied} />
      
      <Header blog={blog} user={user} CurrentUser={CurrentUser} id={id} router={router} />
      
      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BlogContent blog={blog} isContentExpanded={isContentExpanded} setIsContentExpanded={setIsContentExpanded} />
        
        <CommentSection 
          isCommentSectionOpen={isCommentSectionOpen} 
          comments={comments} 
          newComment={newComment} 
          setNewComment={setNewComment} 
          handleCommentSubmit={handleCommentSubmit} 
        />
      </main>
    </div>
  );
};

const LoadingState = () => (
  <Loader/>
);

const ErrorState = ({ error }: { error: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center text-red-500 p-6 bg-black min-h-screen flex items-center justify-center"
  >
    <Card className="bg-gray-900 p-8 rounded-lg shadow-lg">
      <CardContent>
        <h2 className="text-2xl font-bold mb-4 text-white">Error</h2>
        <p>{error}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const NotFoundState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center p-6 bg-black min-h-screen flex items-center justify-center text-white"
  >
    <h2 className="text-3xl font-bold">Blog or User not found</h2>
  </motion.div>
);

const Navbar = ({ router, isCommentSectionOpen, setIsCommentSectionOpen, commentsCount, ShareBlog, isCopied }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCommentSectionOpen(!isCommentSectionOpen)}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <MessageCircle className="h-5 w-5 mr-1" />
            <span>{commentsCount}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={ShareBlog}
            className="text-gray-300 hover:text-white transition-colors relative"
          >
            <Share2 className="h-5 w-5" />
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
);

const Header = ({ blog, user, CurrentUser, id, router }) => (
  <header className="relative pt-20 pb-40 flex items-center">
    <div className="absolute inset-0 overflow-hidden">
      <img src={blog.blogImage} alt={blog.title} className="w-full h-full object-cover filter blur-sm opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-transparent"></div>
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
      >
        {blog.title}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-4 mb-8"
      >
        <Avatar className="w-14 h-14 border-2 border-blue-500">
          <AvatarImage src={user.profilePicture || '/api/placeholder/100/100'} alt={user.firstName} />
          <AvatarFallback>{user.firstName[0]}</AvatarFallback>
        </Avatar>
        <div className="text-left">
          <p className="font-semibold text-xl text-blue-400">{`${user.firstName} ${user.lastName}`}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-6 text-sm text-gray-400"
      >
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(parseInt(blog.createdAt)).toLocaleDateString()}
        </span>
        <span className="flex items-center">
          {CurrentUser ? (
            <ViewTracker userId={CurrentUser?._id} postId={id} />
          ) : (
            <p>Please login to see views</p>
          )}
        </span>
        <span>
          <div className='flex items-center space-x-6 cursor-pointer'>
            {CurrentUser ? (
              <LikesAndUnlike userId={CurrentUser._id} blogId={id} initialLikeCount={0} />
            ) : (
              <p>Please login to like and comments</p>
            )}
            
          </div>
        </span>
      </motion.div>
      <div className="mt-10 flex justify-center">
        <Button
          onClick={() => router.push(`/pages/SummarisePage/${blog?._id}`)}
          className='bg-gradient-to-r from-gray-800 to-gray-500 hover:from-gray-600 hover:to-gray-700 text-white rounded-full px-10 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
        >
          Summarise Blog
        </Button>
      </div>
    </div>
  </header>
);

const BlogContent = ({ blog, isContentExpanded, setIsContentExpanded }) => (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
  </>
);

const CommentSection = ({ isCommentSectionOpen, comments, newComment, setNewComment, handleCommentSubmit }) => (
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
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-4 rounded-lg  bg-gray-900 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-300"
            rows={4}
          />
          <Button
            type="submit"
            className="px-8 py-3 bg-white text-black rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Post Comment
          </Button>
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
                <Avatar className="w-12 h-12 border-2 border-blue-500">
                  <AvatarImage src={comment.userData?.profilePicture || `/api/placeholder/40/40`} alt={`${comment.userData?.firstName} ${comment.userData?.lastName}`} />
                  <AvatarFallback>{comment.userData?.firstName[0]}</AvatarFallback>
                </Avatar>
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
);

export default BlogDetails;