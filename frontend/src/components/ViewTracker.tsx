import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { addView, fetchViewCount } from '@/Firebase/FirebaseViews';

interface ViewTrackerProps {
  userId: string;
  postId: string;
  className?: string;
}

const ViewTracker: React.FC<ViewTrackerProps> = ({ 
  userId, 
  postId, 
  className = '' 
}) => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let viewTracked = false;

    const trackView = async () => {
      if (viewTracked) return;

      try {
        const currentCount = await fetchViewCount(postId);

        if (isMounted && userId && postId) {
          await addView({ userId, postId });
          viewTracked = true;

          const updatedCount = await fetchViewCount(postId);
          
          if (isMounted) {
            setViewCount(updatedCount);
            setIsLoading(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error tracking view:', err);
          setError('Failed to track view');
          setIsLoading(false);
        }
      }
    };

    trackView();

    return () => {
      isMounted = false;
    };
  }, [userId, postId]);

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 text-white ${className}`}>
        <div className="w-4 h-4 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }
  

  if (error) {
    return (
      <div className={`flex items-center space-x-2 text-red-500 ${className}`}>
        <Eye className="w-5 h-5 text-red-500" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 text-white ${className}`}>
      <Eye className="w-5 h-5" />
      <span className="font-medium">
        {viewCount} {viewCount === 1}
      </span>
    </div>
  );
};

export default ViewTracker;