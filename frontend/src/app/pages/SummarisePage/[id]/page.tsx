'use client'
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries';
import SummariseContent from '@/components/SummariseContent';
import Loader from '@/components/Loader';

const SummarisePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [blogContent, setBlogContent] = useState<string>('');

  const { data, loading, error } = useQuery(GET_SINGLEBLOG, {
    variables: { blogId: id },
    skip: !id,
  });

  useEffect(() => {
    if (data?.blog?.blogContent) {
      setBlogContent(data.blog.blogContent);
    }
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Summarise Your Blog</h1>
      <SummariseContent setBlogContent={setBlogContent} prompt={`Summarise this content: ${data.blog.blogContent}`} />
      {blogContent && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Summarised Content:</h2>
          <div
            className="prose prose-lg prose-invert"
            dangerouslySetInnerHTML={{ __html: blogContent }}
          />
        </div>
      )}
    </div>
  );
};

export default SummarisePage;
