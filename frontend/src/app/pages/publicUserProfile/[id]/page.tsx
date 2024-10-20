'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import UserProfile from '@/components/userProfile';
import { useEffect, useState } from 'react';
import { GET_SINGLEBLOG } from '@/Graphql/queries/blogQueries';
import { GetBlogQuery, GetBlogQueryVariables } from '@/gql/graphql';

const PublicUserProfile = () => {
  const [userId, setUserId] = useState('');
  const params = useParams();
  const id = params.id as string; 
  
  console.log("User after params (URL id):", id); 

  const { data, loading, error } = useQuery<GetBlogQuery, GetBlogQueryVariables>(GET_SINGLEBLOG, {
    variables: { blogId: id },
  });


  useEffect(() => {
    if (data.blog.user._id) {
      setUserId(data.blog.user._id); 
    }
  }, [data]);

  
  if (loading) return <Loader />;

  if (error) {
    console.error("Error fetching user:", error);
    return <div className='text-red-700 text=5xl text-center'>Error fetching user</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-10">
      {userId ? <UserProfile userId={userId} showEmail={true} /> : <div>No user found.</div>}
    </div>
  );
};

export default PublicUserProfile;
