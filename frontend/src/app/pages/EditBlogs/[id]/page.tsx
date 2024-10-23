'use client';

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATEBLOG } from '@/Graphql/mutations/blogMutations';
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries';
import { UpdateBlogMutation, UpdateBlogInput } from '@/gql/graphql';
import { GetBlogQuery, GetBlogQueryVariables } from '@/gql/graphql';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { useForm, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const EditBlogs = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const { data, loading, error } = useQuery<GetBlogQuery, GetBlogQueryVariables>(GET_SINGLEBLOG, {
    variables: { blogId: id }
  });

  const [updateBlog] = useMutation<UpdateBlogMutation, { input: UpdateBlogInput }>(UPDATEBLOG);
  
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      title: '',
      blogImage: '',
      blogContent: ''
    }
  });

  useEffect(() => {
    if (data && data.blog) {
      const { title, blogImage, blogContent } = data.blog;
      setValue('title', title);
      setValue('blogImage', blogImage);
      setValue('blogContent', blogContent);
    }
  }, [data, setValue]);

  const onSubmit = async (values: { title: string; blogImage: string; blogContent: string }) => {
    try {
      await updateBlog({
        variables: {
          input: {
            blogId: id,
            title: values.title,
            blogImage: values.blogImage,
            blogContent: values.blogContent,
          },
        },
      });
      router.push("/pages/Dashboard");
      toast.success("Blog updated");
    } catch (err) {
      console.error('Error updating blog:', err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">Error loading blog: {error.message}</div>;

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-14 md:h-16">
            <h1 className="text-xl md:text-2xl font-semibold truncate">Edit Blog</h1>
            <button
              type="button"
              onClick={() => router.push("/pages/Dashboard")}
              className="text-white p-2 rounded-md hover:text-black bg-black transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 md:pt-24 pb-24 px-3 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Left Column - Title and Image */}
            <div className="lg:col-span-1 space-y-4 md:space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                <label className="block text-sm font-medium mb-2" htmlFor="title">Title</label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="title"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-base md:text-lg px-3 py-2 md:px-4 md:py-3"
                      required
                    />
                  )}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                <label className="block text-sm font-medium mb-2" htmlFor="blogImage">Featured Image</label>
                <Controller
                  name="blogImage"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="blogImage"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black px-3 py-2 md:px-4 md:py-3 mb-4"
                    />
                  )}
                />
                {data?.blog?.blogImage && (
                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={data.blog.blogImage} 
                      alt="Preview" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Editor */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6">
                <Controller
                  name="blogContent"
                  control={control}
                  render={({ field }) => (
                    <div className="h-[calc(100vh-280px)] md:h-[calc(100vh-240px)] flex flex-col">
                      <ReactQuill
                        {...field}
                        theme="snow"
                        placeholder="Start writing your blog post..."
                        className="flex-1 overflow-y-auto [&_.ql-editor]:min-h-[calc(100vh-400px)] [&_.ql-editor]:text-base md:text-lg [&_.ql-editor]:leading-relaxed [&_.ql-toolbar]:flex [&_.ql-toolbar]:flex-wrap [&_.ql-toolbar]:gap-1 [&_.ql-toolbar]:p-2 [&_.ql-container]:text-base md:text-lg"
                        modules={{
                          toolbar: isMobileView ? [
                            [{ header: [1, 2, false] }],
                            ['bold', 'italic'],
                            [{ list: 'bullet' }],
                            ['link'],
                            ['clean']
                          ] : [
                            [{ header: [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            [{ align: [] }],
                            ['link', 'image'],
                            ['clean']
                          ]
                        }}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4 flex justify-between items-center">
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">All changes are automatically saved</p>
              <button
                type="submit"
                className="w-full sm:w-auto bg-black text-white px-4 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base"
              >
                Publish Changes
              </button>
            </div>
          </div>
        </form>
      </main>
    </motion.div>
  );
};

export default EditBlogs;