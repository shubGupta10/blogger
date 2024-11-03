'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreateBlog = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Toolbar options for Quill editor
  const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'video', 'code-block'],
    ['clean']
  ];

  // Enhanced Quill Editor Component
  const EnhancedQuillEditor = ({
    form,
    isClient,
    placeholder = "Start writing your blog post...",
    maxHeight = 'calc(100vh - 280px)',
    editorClassName = '',
    onChangeHandler
  }) => {
    const modules = useMemo(() => ({
      toolbar: toolbarOptions,
      clipboard: {
        matchVisual: false,
      }
    }), []);

    return (
      <div className="bg-white dark:bg-gray-300 dark:text-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-900 p-6">
        {isClient && (
          <Controller
            name="blogContent"
            control={form.control}
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <div
                className={`h-[${maxHeight}] md:h-[calc(100vh-240px)] flex flex-col`}
              >
                <ReactQuill
                  {...fieldProps}
                  value={value || ''}
                  onChange={(content, delta, source, editor) => {
                    onChange(content);
                    onChangeHandler && onChangeHandler(content, editor);
                  }}
                  modules={modules}
                  theme="snow"
                  placeholder={placeholder}
                  className={`flex-1 overflow-y-auto 
                    [&_.ql-editor]:min-h-[calc(100vh-400px)] 
                    [&_.ql-editor]:text-base 
                    md:text-lg 
                    [&_.ql-editor]:leading-relaxed 
                    [&_.ql-toolbar]:flex 
                    [&_.ql-toolbar]:flex-wrap 
                    [&_.ql-toolbar]:gap-1 
                    ${editorClassName}`}
                />
              </div>
            )}
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    setIsClient(true);
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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Fixed Header with Shadow */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-black shadow-md z-50">
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
                className="px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium tracking-wide hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoBack}
                className="px-4  py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium tracking-wide hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                Go Back
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Improved Spacing */}
      <main className="pt-20 pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Selection */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">Blog Category</label>
              <Select
                onValueChange={(value) => form.setValue('blogCategory', value)}
              >
                <SelectTrigger className="w-full max-w-sm border-gray-300 dark:border-gray-700 focus:ring-black focus:border-black">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="web-development">Web Development</SelectItem>
                  <SelectItem value="mobile-development">Mobile Development</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="artificial-intelligence">Artificial Intelligence</SelectItem>
                  <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="mental-health">Mental Health</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="recipes">Recipes</SelectItem>
                  <SelectItem value="parenting">Parenting</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="investing">Investing</SelectItem>
                  <SelectItem value="personal-finance">Personal Finance</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="astronomy">Astronomy</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="movies">Movies</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="tv-shows">TV Shows</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="politics">Politics</SelectItem>
                  <SelectItem value="world-news">World News</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="animals">Animals</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                  <SelectItem value="startups">Startups</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="self-improvement">Self Improvement</SelectItem>
                  <SelectItem value="spirituality">Spirituality</SelectItem>
                  <SelectItem value="philosophy">Philosophy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload with Preview */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Featured Image</label>
              <label className="block text-sm text-gray-600 dark:text-white mb-4">
                Only supports <strong className="text-black dark:text-white">PNG, JPEG, and JPG</strong> images
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm cursor-pointer file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black dark:file:bg-white file:text-white dark:file:text-black hover:file:bg-gray-900 dark:hover:file:bg-white transition-colors"
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
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">AI Content Generator</h3>
              <GenerativeContent setBlogContent={setGeneratedContent} blogTitle={form.watch('title')} />
            </div>
          </div>

          {/* Editor with Better Visibility */}
          <div className="lg:col-span-2">
            <EnhancedQuillEditor
              form={form}
              isClient={isClient}
              onChangeHandler={(content, editor) => {
                console.log('Content updated:', content);
              }}
            />
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
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg text-sm font-medium shadow-lg"
          >
            Unsaved changes
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateBlog;