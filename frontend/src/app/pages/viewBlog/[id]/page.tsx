'use client';
import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { motion } from 'framer-motion';
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries';
import { GetBlogQuery, GetBlogQueryVariables } from '@/gql/graphql';
import { ChevronDown, Heart, Share2Icon, MessageCircle, Calendar, User } from 'lucide-react';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { addComment, fetchCommentsByPostId } from '@/Firebase/FirebaseComments';
import { FETCH_USER_BY_ID } from '@/Graphql/queries/userQueries';
import { useMyContext } from '@/context/ContextProvider';
import { Button } from '@/components/ui/button';

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
  const { user: CurrentUser } = useMyContext()
  console.log(CurrentUser);

  const { id } = params;
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false)

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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Loader />
    </div>
  );

  if (blogError || userError) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-red-500 p-6 bg-black min-h-screen flex items-center justify-center"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{blogError?.message || userError?.message}</p>
      </div>
    </motion.div>
  );

  const blog = blogData?.blog;
  const user = userData?.fetchUserByID;

  const handleSubmit = () => {
    router.push(`/pages/SummarisePage/${blog?._id}`)
  }

  if (!blog || !user) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center p-6 bg-black min-h-screen flex items-center justify-center text-white"
    >
      <h2 className="text-3xl font-bold">Blog or User not found</h2>
    </motion.div>
  );

  const userDataForComment: User = {
    userId: user._id,
    firstName: user.firstName,
    lastName: user.lastName || '',
    email: user.email,
    profilePicture: user.profilePicture,
  };

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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const handleOpenPublicProfile = (userId: string) => {
    router.push(`/pages/publicUserProfile/${userId}`);
  };


  const ShareBlog = () => {
    const CurrentUrl = window.location.href;
    navigator.clipboard.writeText(CurrentUrl).then(() => {
      setIsCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setIsCopied(false), 5000)
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy link');
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-screen"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        <img src={blog.blogImage} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <motion.h1
            {...fadeIn}
            className="text-4xl md:text-6xl mb-8 font-bold text-white"
          >
            {blog.title}
          </motion.h1>
          <motion.div
            {...fadeIn}
            className="flex items-center space-x-4 cursor-pointer text-white"
            onClick={() => handleOpenPublicProfile(user._id)}
          >
            <img
              src={user.profilePicture || '/api/placeholder/100/100'}
              alt={user.firstName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
            <div>
              <p className="font-semibold">{`${user.firstName} ${user.lastName}`}</p>
              <p className="text-sm text-gray-300">{user.email}</p>
            </div>
          </motion.div>
          <motion.div
            {...fadeIn}
            className='flex justify-end items-center gap-6 mt-4'
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsCommentSectionOpen(!isCommentSectionOpen)}>
              <MessageCircle className="cursor-pointer" />
            </motion.div>
            <motion.div onClick={ShareBlog} className='relative' whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Share2Icon className="cursor-pointer" />
              {isCopied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-10  bg-white text-black px-1 py-1 rounded text-xs whitespace-nowrap"
                >
                  Copied!
                </motion.div>
              )}
            </motion.div>
            <div >
              <Button onClick={handleSubmit} className='bg-white hover:bg-white text-black rounded '>Summarise Blog</Button>
            </div>

          </motion.div>

        </div>
      </motion.div>


      <div className="max-w-4xl mx-auto px-6 py-12">
        {isCommentSectionOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Comments</h2>
            <form onSubmit={handleCommentSubmit} className="flex flex-col mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="p-4 rounded-lg bg-gray-800 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-white"
                rows={3}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="self-start py-2 px-6 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold"
              >
                Submit
              </motion.button>
            </form>
            <div className="space-y-6">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  className="bg-gray-800 p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-3">
                    <img
                      src={comment.userData?.profilePicture || `/api/placeholder/40/40`}
                      alt={`${comment.userData?.firstName} ${comment.userData?.lastName}`}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <strong className="text-lg">{`${comment.userData?.firstName} ${comment.userData?.lastName}`}</strong>
                      <p className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="mb-2 text-gray-200">{comment.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              {...fadeIn}
              className="flex items-center space-x-4 mb-8 text-white"
            >
              <Calendar size={20} />
              <span>{new Date(parseInt(blog.createdAt)).toLocaleDateString()}</span>
              <User size={20} />
              <span>{`${user.firstName} ${user.lastName}`}</span>
            </motion.div>

            <motion.div
              {...fadeIn}
              className={`prose prose-lg prose-invert max-w-none mb-8 ${isContentExpanded ? '' : 'line-clamp-5'}`}
              dangerouslySetInnerHTML={{ __html: blog.blogContent }}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsContentExpanded(!isContentExpanded)}
              className="flex items-center justify-center w-full py-4 bg-white text-black rounded-lg font-semibold mt-6 transition-colors duration-300 hover:bg-gray-200"
            >
              {isContentExpanded ? 'Read Less' : 'Read More'}
              <ChevronDown className={`ml-2 transform transition-transform duration-300 ${isContentExpanded ? 'rotate-180' : ''}`} />
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;