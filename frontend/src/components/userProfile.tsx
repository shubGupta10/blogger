'use client';

import { useQuery } from '@apollo/client';
import { FetchUserByIdDocument, FetchUserByIdQuery, FetchUserByIdQueryVariables } from '@/gql/graphql';
import Loader from '@/components/Loader';
import { motion } from 'framer-motion';

interface UserProfileProps {
  userId: string;
  showEmail?: boolean; 
}

const UserProfile = ({ userId, showEmail = false }: UserProfileProps) => {
  const { data, loading, error } = useQuery<FetchUserByIdQuery, FetchUserByIdQueryVariables>(
    FetchUserByIdDocument,
    {
      variables: { userId },
      skip: !userId, 
    }
  );

  if (loading) return <Loader />;
  if (error) {
    console.error("Error fetching user:", error);
    return <div>Error fetching user</div>;
  }

  const user = data?.fetchUserByID;

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-48 h-48 rounded-full overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <img
          src={user?.profilePicture}
          alt={`${user?.firstName} ${user?.lastName}`}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
          {user?.firstName} {user?.lastName}
        </h1>
        {showEmail && (
          <p className="text-xl text-gray-500 dark:text-gray-400">{user?.email}</p>
        )}
        <p className="text-lg text-gray-400 dark:text-gray-500">
          Gender: {user?.gender}
        </p>
        <p className="text-lg text-gray-400 dark:text-gray-500">
          Blogs Created: {user?.blogs?.length ?? 0}
        </p>
      </div>
    </motion.div>
  );
};

export default UserProfile;
