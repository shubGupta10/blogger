'use client';

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {UPDATEBLOG} from '@/Graphql/mutations/blogMutations' 
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries'; 
import { UpdateBlogMutation, UpdateBlogInput } from '@/gql/graphql';
import { GetBlogQuery, GetBlogQueryVariables } from '@/gql/graphql';
import { useRouter } from 'next/navigation';

const EditBlogs = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();

  const { data, loading, error } = useQuery<GetBlogQuery, GetBlogQueryVariables>(GET_SINGLEBLOG, {
    variables: { blogId: id }
  });

  const [updateBlog] = useMutation<UpdateBlogMutation, { input: UpdateBlogInput }>(UPDATEBLOG);
  const [title, setTitle] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogContent, setBlogContent] = useState('');

  useEffect(() => {
    if (data && data.blog) {
      const { title, blogImage, blogContent } = data.blog;
      setTitle(title);
      setBlogImage(blogImage);
      setBlogContent(blogContent);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateBlog({
        variables: {
          input: {
            blogId: id,
              title,
              blogImage,
              blogContent,
          },
        },
      });
      router.push("/pages/Dashboard"); 
    } catch (err) {
      console.error('Error updating blog:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading blog: {error.message}</p>;

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-4xl font-bold mb-8">Edit Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="blogImage">Blog Image URL</label>
          <input
            type="text"
            id="blogImage"
            value={blogImage}
            onChange={(e) => setBlogImage(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="blogContent">Content</label>
          <textarea
            id="blogContent"
            value={blogContent}
            onChange={(e) => setBlogContent(e.target.value)}
            className="border rounded-lg p-2 w-full"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlogs;
