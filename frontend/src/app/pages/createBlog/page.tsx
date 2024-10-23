'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { CreateBlogMutation, CreateBlogDocument, CreateBlogMutationVariables } from '@/gql/graphql';
import { uploadImage } from '@/Firebase/firebaseStorage';
import GenerativeContent from '@/components/GenerativeContent';
import 'react-quill/dist/quill.snow.css';
import { GET_BLOGS_BY_USER } from '@/Graphql/queries/blogQueries';
import Loader from '@/components/Loader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreateBlog = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isClient, setIsClient] = useState(false);  // Added to check client-side rendering

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering
  }, []);

  const form = useForm({
    defaultValues: {
      title: '',
      blogImage: '',
      blogContent: '',
      blogCategory: ''
    },
  });

  const [createBlog, { loading, error }] = useMutation<CreateBlogMutation, CreateBlogMutationVariables>(
    CreateBlogDocument,
    {
      refetchQueries: [{ query: GET_BLOGS_BY_USER }],
    }
  );

  const router = useRouter();

  const onSubmit = async (data: any) => {
    if (!data.title.trim()) {
      toast.error('Please enter a blog title');
      return;
    }
    if (!data.blogCategory) {
      toast.error('Please select a blog category');
      return;
    }

    setIsPublishing(true);
    try {
      if (imageFile) {
        const downloadURL = await uploadImage(imageFile);
        data.blogImage = downloadURL;
      }

      await createBlog({ variables: { input: data } });
      toast.success('Blog published successfully!');
      router.push('/pages/Dashboard');
      form.reset();
    } catch (error) {
      toast.error('Failed to publish blog');
      console.error('Error:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const setGeneratedContent = (content: string) => {
    form.setValue('blogContent', content);
  };

  const handleGoBack = () => {
    router.push('/pages/Dashboard');
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">Something went wrong</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header with Shadow */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4 md:gap-6">
            <div className="flex-1  relative">
              <input
                {...form.register('title')}
                placeholder="Enter your blog title"
                className="w-full text-xl md:text-2xl font-semibold focus:outline-none border-b-2 border-transparent focus:border-black transition-colors py-2"
              />
            </div>

            {/* Button Container for Publish button */}
            <div className="flex flex-row gap-2  md:gap-4 items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPublishing}
                className="px-4 py-2.5 bg-black text-white rounded-lg text-sm font-medium tracking-wide hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoBack}
                className="px-4  py-2.5 bg-black text-white rounded-lg text-sm font-medium tracking-wide hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                Go Back
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Improved Spacing */}
      <main className="pt-16 pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold mb-3 text-gray-900">Blog Category</label>
              <Select
                onValueChange={(value) => form.setValue('blogCategory', value)}
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-black focus:border-black">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload with Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold mb-2 text-gray-900">Featured Image</label>
              <label className="block text-sm text-gray-600 mb-4">
                Only supports <strong className="text-black">PNG, JPEG, and JPG</strong> images
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm cursor-pointer file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-900 transition-colors"
                />
                {imagePreview && (
                  <div className="mt-4 relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>


            {/* AI Content Generator */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold mb-3 text-gray-900">AI Content Generator</h3>
              <GenerativeContent setBlogContent={setGeneratedContent} blogTitle={form.watch('title')} />
            </div>
          </div>

          {/* Editor with Better Visibility */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {isClient && (
                <Controller
                  name="blogContent"
                  control={form.control}
                  render={({ field }) => (
                    <div className="h-[calc(100vh-280px)] md:h-[calc(100vh-240px)] flex flex-col">
                      <ReactQuill
                        {...field}
                        theme="snow"
                        placeholder="Start writing your blog post..."
                        className="flex-1 overflow-y-auto [&_.ql-editor]:min-h-[calc(100vh-400px)] [&_.ql-editor]:text-base md:text-lg [&_.ql-editor]:leading-relaxed [&_.ql-toolbar]:flex [&_.ql-toolbar]:flex-wrap [&_.ql-toolbar]:gap-1"
                      />
                    </div>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Unsaved changes */}
      <AnimatePresence>
        {form.formState.isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg"
          >
            Unsaved changes
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateBlog;
