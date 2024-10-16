'use client';

import { useQuery } from '@apollo/client';
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries';
import { GetBlogQuery, GetBlogQueryVariables } from '@/gql/graphql';

const BlogDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params; 

  const { data, loading, error } = useQuery<GetBlogQuery, GetBlogQueryVariables>(GET_SINGLEBLOG, {
    variables: { blogId: id },
  });

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading blog: {error.message}</p>;

  const blog = data?.blog;

  if (!blog) return <p className="text-center">Blog not found</p>;

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-4xl font-bold mb-8">{blog.title}</h1>
      <img src={blog.blogImage} alt={blog.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      <p className="text-gray-700 text-lg mb-6">{blog.blogContent}</p>
      <div className="text-sm text-gray-500 mt-4">
        <p>Created at: {new Date(blog.createdAt).toLocaleDateString()}</p>
        <div className="flex items-center space-x-2 mt-4">
          <img src={blog.user?.profilePicture || '/default-avatar.png'} alt={blog.user?.firstName} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold">{`${blog.user?.firstName} ${blog.user?.lastName}`}</p>
            <p className="text-xs text-gray-400">{blog.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
