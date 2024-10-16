'use client'
import { useMutation, useQuery } from '@apollo/client';
import { GET_BLOGS_BY_USER } from '@/Graphql/queries/blogQueries';
import { Trash2, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { DeleteBlogDocument, DeleteBlogMutation, DeleteBlogMutationVariables } from '@/gql/graphql';
import { useRouter } from 'next/navigation';

interface Blog {
  _id: string;
  title: string;
  blogImage: string;
  blogContent: string;
  createdAt: string;
}

const UserBlogs = () => {
  const { data, loading, error } = useQuery(GET_BLOGS_BY_USER);
  const [deleteBlog] = useMutation<DeleteBlogMutation, DeleteBlogMutationVariables>(DeleteBlogDocument, {
    refetchQueries: [{ query: GET_BLOGS_BY_USER }],
  });
  const router = useRouter();

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading blogs: {error.message}</p>;

  const blogs = data?.blogsByUser || [];
  console.log(blogs);

  const handleDelete = async (blogId: string) => {
    try {
      await deleteBlog({ variables: { blogId } });
      toast.success('Blog deleted successfully');
    } catch (error: any) {
      throw new Error('Failed to delete blog');
    }
  };

  const handleEdit = (blogId: string) => {
    router.push(`/pages/EditBlogs/${blogId}`)
  }

  const handleOpen = (blogId: string) => {
    router.push(`/pages/blogs/${blogId}`);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">My Blogs</h1>
      <div className="space-y-6">
        {blogs.map((blog: Blog) => (
          <div
            key={blog._id}
            className="flex flex-col md:flex-row border-2 border-black items-start md:items-center bg-white text-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out"
          >
            <img
              src={blog.blogImage}
              alt={blog.title}
              className="w-full md:w-1/4 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-grow">
              <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
              <p className="text-gray-700 mb-4">{blog.blogContent.substring(0, 150)}...</p>
              <p className="text-sm text-gray-500">Created at: {new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <button
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                onClick={() => handleOpen(blog._id)}
              >
                <span>Open</span>
              </button>
              <button
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                onClick={() => handleEdit(blog._id)}
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit</span>
              </button>
              <button
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                onClick={() => handleDelete(blog._id)}
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBlogs;
