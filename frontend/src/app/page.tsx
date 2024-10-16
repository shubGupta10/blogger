'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Pen, Globe, ChartBar, Users, Zap, BookOpen } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-800">

<motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="absolute top-20 left-20 w-40 h-40 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-40 h-40 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </motion.div>
        
        <div className="z-10 text-center">
          <motion.h1 
            className="text-5xl sm:text-7xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          >
            Elevate Your Voice
          </motion.h1>
          <motion.h2 
            className="text-2xl sm:text-3xl mb-8 text-center max-w-2xl text-gray-600"
            initial={{ y: -30 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
          >
            Create, Share, and Inspire with Blogger's Modern Platform
          </motion.h2>
          <motion.div
            className="flex justify-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <button className="bg-gray-800 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-700 transition duration-300 flex items-center">
              Start Writing <ArrowRight className="ml-2" />
            </button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Why Choose Blogger?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Pen, title: 'Intuitive Editor', description: 'Write and format your posts with ease' },
              { icon: Globe, title: 'Global Reach', description: 'Connect with readers worldwide' },
              { icon: ChartBar, title: 'Powerful Analytics', description: 'Gain insights into your audience' },
              { icon: Users, title: 'Community Building', description: 'Foster a loyal readership' },
              { icon: Zap, title: 'Fast Performance', description: 'Optimized for speed and efficiency' },
              { icon: BookOpen, title: 'Rich Media Support', description: 'Embed images, videos, and more' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200"
                whileHover={{ scale: 1.05, backgroundColor: '#f8f8f8', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <feature.icon className="w-12 h-12 mb-4 text-gray-700" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah L.', quote: 'Blogger transformed my writing experience. It\'s intuitive and powerful!' },
              { name: 'John D.', quote: 'The analytics feature helped me understand my audience better.' },
              { name: 'Emma W.', quote: 'I\'ve connected with so many like-minded individuals through Blogger.' }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <p className="text-lg mb-4 text-gray-600">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-800">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join our community of passionate writers and readers. Your story matters.</p>
          <motion.button 
            className="bg-white text-gray-800 py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
        </div>
      </motion.div>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Blogger</h3>
              <p>Empowering voices since 2024</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300 transition">About Us</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">Features</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300 transition">Twitter</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">Facebook</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">Instagram</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2024 Blogger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;