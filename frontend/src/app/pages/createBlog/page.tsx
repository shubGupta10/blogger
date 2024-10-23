'use client';

import React, { useState } from 'react';
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
    console.log('Form data being sent:', data);
    setIsPublishing(true);
    try {
        if (imageFile) {
            const downloadURL = await uploadImage(imageFile);
            data.blogImage = downloadURL;
        } else {
            data.blogImage = ""; 
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
      setImageFile(event.target.files[0]);
    }
  };

  const setGeneratedContent = (content: string) => {
    form.setValue('blogContent', content);
  };

  if (loading) return <Loader />;
  
  if (error) return <h3 className="text-red-700 text-3xl text-center mx-auto">Something went wrong</h3>;

  return (
    <div className="min-h-screen bg-white text-black pt-14">
      <header className="relative left-0 right-0 bg-white z-10 border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
          <input
            {...form.register('title')}
            placeholder="Enter your blog title"
            className="text-2xl font-bold focus:outline-none w-2/3"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPublishing}
            className="px-6 py-2 bg-black text-white rounded-full transition-colors duration-300 hover:bg-gray-800 focus:outline-none"
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </motion.button>
        </div>
      </header>

      <main className="pt-10 pb-10 px-4 max-w-screen-xl mx-auto">
        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full cursor-pointer mb-4 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        {/* Select for blog category */}
        <div className="mb-4">
        <Select onValueChange={(value) => form.setValue('blogCategory', value)}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select Category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="technology">Technology</SelectItem>
    <SelectItem value="lifestyle">Lifestyle</SelectItem>
    <SelectItem value="education">Education</SelectItem>
    <SelectItem value="health">Health</SelectItem>
    <SelectItem value="travel">Travel</SelectItem>
  </SelectContent>
</Select>

        </div>

        <GenerativeContent setBlogContent={setGeneratedContent} blogTitle={form.watch('title')} />

        <Controller
          name="blogContent"
          control={form.control}
          render={({ field }) => (
            <ReactQuill
              {...field}
              theme="snow"
              placeholder="Start writing your blog post..."
              className="h-[calc(100vh-240px)] mb-12"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
            />
          )}
        />
      </main>

      <AnimatePresence>
        {form.formState.isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-sm"
          >
            Unsaved changes
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateBlog;
