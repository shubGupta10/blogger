import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BLOGS_BY_USER } from '@/Graphql/queries/blogQueries';
import { Trash2, Edit3, Eye, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { DeleteBlogDocument, DeleteBlogMutation, DeleteBlogMutationVariables } from '@/gql/graphql';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Blog {
  _id: string;
  title: string;
  blogImage: string;
  blogContent: string;
  createdAt: string;
}

const UserBlogs = () => {
  const { data, loading, error } = useQuery(GET_BLOGS_BY_USER);
  const [deleteBlog, { loading: deleteLoading }] = useMutation<DeleteBlogMutation, DeleteBlogMutationVariables>(
    DeleteBlogDocument,
    {
      refetchQueries: [{ query: GET_BLOGS_BY_USER }],
    }
  );
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  const handleDelete = async (blogId: string) => {
    try {
      setDeletingBlogId(blogId);
      await deleteBlog({ variables: { blogId } });
      toast.success('Blog deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete blog');
    } finally {
      setDeletingBlogId(null);
    }
  };

  const blogs = data?.blogsByUser || [];
  const filteredBlogs = blogs.filter((blog: Blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.blogContent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-black" />
          <p className="text-gray-600">Loading your blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="max-w-md p-6 text-center space-y-4 bg-gray-50 rounded-lg">
          <p className="text-xl font-semibold text-gray-900">Unable to load blogs</p>
          <p className="text-gray-600">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Blogs</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage and explore your collection of {blogs.length} blog posts
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search your blogs..."
                className="w-full px-4 py-3 pl-10 pr-4 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 transition-colors placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Blog Grid */}
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
                  className="col-span-full text-center py-12"
                >
                  <p className="text-xl text-gray-600">No blogs found matching your search.</p>
                </motion.div>
              ) : (
                filteredBlogs.map((blog: Blog) => (
                  <motion.article
                    key={blog._id}
                    layoutId={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.blogImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col flex-grow p-6">
                      <div className="flex-grow space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">
                          {blog.title}
                        </h2>
                        <div 
                          className="text-gray-600 line-clamp-3 text-sm min-h-[4.5rem]"
                          dangerouslySetInnerHTML={{ __html: blog.blogContent }}
                        />
                        <p className="text-sm text-gray-500">
                          {new Date(parseInt(blog.createdAt)).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-3 grid-cols-1 gap-2 mt-6 pt-6 border-t border-gray-100">
                        <button
                          onClick={() => router.push(`/pages/blogs/${blog._id}`)}
                          className="inline-flex justify-center items-center px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors gap-2 md:text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => router.push(`/pages/EditBlogs/${blog._id}`)}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors gap-2 text-sm"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deleteLoading && deletingBlogId === blog._id}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors gap-2 text-sm"
                        >
                          {deleteLoading && deletingBlogId === blog._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserBlogs;