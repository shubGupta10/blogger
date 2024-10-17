'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries';
import Loader from '@/components/Loader';
import UserProfile from '@/components/userProfile'

const PublicUserProfile = () => {
  const params = useParams();
  const blogId = params.id as string;

  const { data: blogData, loading: loadingBlog, error: blogError } = useQuery(GET_SINGLEBLOG, {
    variables: { blogId },
    skip: !blogId,
  });

  if (loadingBlog) return <Loader />;
  if (blogError) {
    console.error("Error fetching blog:", blogError);
    return <div>Error fetching blog</div>;
  }

  const userId = blogData?.blog?.user?._id;

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-10">
      {userId ? <UserProfile userId={userId} showEmail={true} /> : <div>No user found.</div>}
    </div>
  );
};

export default PublicUserProfile;
