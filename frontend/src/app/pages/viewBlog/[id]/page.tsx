'use client'
import React from 'react'
import { useQuery } from '@apollo/client';
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries';
import { GetBlogQuery, GetBlogQueryVariables } from '@/gql/graphql';
import Loader from '@/components/Loader';

const viewBlog = ({params}: {params: {id: string}}) => {
    const {id} = params;

    const {loading, error, data} = useQuery<GetBlogQuery, GetBlogQueryVariables>(GET_SINGLEBLOG, {
        variables: {blogId: id}
    })

    if(loading) return <div><Loader/></div>
    if (error) return <div className="text-red-500 text-center mt-10">Error: {error.message}</div>;

  if (!data || !data.blog) {
    return <div className="text-center">Blog not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{data.blog.title}</h1>

        {data.blog.blogImage && (
          <img
            src={data.blog.blogImage}
            alt={data.blog.title}
            className="w-full h-64 object-cover mb-6 rounded-lg"
          />
        )}

        <div className="text-lg text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: data.blog.blogContent }} />

        <div className="flex items-center text-sm text-gray-500">
          {data.blog.user.profilePicture && (
            <img
              src={data.blog.user.profilePicture}
              alt={`${data.blog.user.firstName} ${data.blog.user.lastName}`}
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <span>
            {data.blog.user.firstName} {data.blog.user.lastName ?? ''}
          </span>
        </div>

        <p className="text-gray-500 mt-2">
          {new Date(data.blog.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default viewBlog