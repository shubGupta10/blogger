import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-sm z-50">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 border-[16px] border-gray-200 dark:border-gray-800 rounded-full"></div>
        <div
          className="absolute inset-0 border-[16px] border-black dark:border-white rounded-full border-t-transparent dark:border-t-transparent"
          style={{ animation: 'spin 0.5s linear infinite' }} 
        ></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
