'use client'
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Edit, Lock, Zap, Type, MessageSquare, FileText, Search, Filter, User, Users2, Share } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import StatsSection from '@/components/StatsSection';
import Image from 'next/image';
import blog from '@/public/blog.png'

const Home = () => {


  const router = useRouter();

  const handleGetStarted = () => {
    if (Cookies.get('token') || localStorage.getItem('token')) {
      router.push("/");
    } else {
      router.push("/Auth/signUp");
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="flex flex-col min-h-screen  ">
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.2, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>

        <div className="relative z-10 text-center">
          <div className="flex justify-center items-center bg-white dark:bg-black rounded-full w-52 h-52 mx-auto ">
            <Image
              alt="Blog Home image"
              src={blog}
              width={200} 
              height={200} 
              className="transition-all duration-300 ease-in-out dark:filter dark:invert"
            />
          </div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text bg-gradient-to-r from-black to-gray-700 leading-snug py-2"
            {...fadeInUp}
          >
            Elevate Your Blogging Experience
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
            {...fadeInUp}
          >
            Seamlessly create and share captivating content that resonates with your audience.
          </motion.p>

          <motion.button
            className="py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 dark:hover:text-black dark:bg-gray-700 transition duration-300 flex items-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
          >
            Get Started <ArrowRight className="ml-2" />
          </motion.button>
        </div>
      </motion.section>







      {/* Features Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-12 text-center"
            {...fadeInUp}
          >
            Some features of Blogger
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: 'AI Integration', description: 'Harness the power of AI to generate ideas, outlines, and even full blog posts' },
              { icon: FileText, title: 'Summarise Blog', description: 'Summarise your blogs using gemini to read the blog effectively' },
              { icon: Edit, title: 'Rich Editor', description: 'Intuitive and powerful editing tools for crafting perfect content' },
              { icon: Lock, title: 'Secure Authentication', description: 'Secure user authentication to keep your account safe' },
              { icon: Zap, title: 'Interactive UI', description: 'Enjoy a smooth, responsive interface for effortless blogging' },
              { icon: Search, title: 'Search Functionality', description: 'Integrated search functionality, users can search their favorite blogs' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className=" p-6 rounded-lg text-center shadow-md border border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <feature.icon className="w-12 h-12 text-black dark:text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-white">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20'>
        <StatsSection />
      </section>


      {/* How It Works Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-12 text-center"
            {...fadeInUp}
          >
            How AI Enhances Your Blogging
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Type, step: '1', title: 'Create Blog Title', description: 'Start by crafting a compelling title for your blog post' },
              { icon: MessageSquare, step: '2', title: 'Write Prompt', description: 'Enter a detailed prompt or use your blog title to guide the AI' },
              { icon: FileText, step: '3', title: 'Generate Content', description: 'Let AI create a draft based on your title or prompt' },
              { icon: Filter, step: '4', title: 'Summarise Blogs', description: 'Summarise your blog for the best understanding' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <item.icon className="w-8 h-8 mb-4 mx-auto text-gray-700 dark:text-white" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-white">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20  text-black dark:text-white">
        <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            {...fadeInUp}
          >
            Ready to Supercharge Your Blog?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto"
            {...fadeInUp}
          >
            Join  bloggers, leveraging AI to create outstanding content. Your AI writing journey starts here.
          </motion.p>
          <motion.button
            className="bg-black dark:bg-white text-white dark:text-black py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
          >
            Begin your Journey
          </motion.button>
        </div>
      </section>


    </div>
  );
};

export default Home;