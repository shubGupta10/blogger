'use client'
import React from 'react';
import Image from 'next/image';
import comingSoon from '@/public/comingSoon.png';

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl">
        <Image
          src={comingSoon}
          alt="Coming Soon"
          width={400}
          height={400}
          className="mx-auto mb-8 w-full max-w-md h-auto"
          priority
        />
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
          This feature is Coming Soon!
        </h1>
        <p className="text-xl mb-8 text-gray-600 leading-relaxed">
          Stay tuned for updates and get ready for an exciting new experience!
        </p>
        <div className="inline-flex rounded-md shadow">
          <a
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 transition duration-150 ease-in-out"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;