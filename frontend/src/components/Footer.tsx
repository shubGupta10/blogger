import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4"> Blogger</h3>
              <p>Revolutionizing content creation since 2024</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300 transition">About AI Blogging</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">Features</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">AI Ethics</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300 transition">Twitter</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">YouTube</a></li>
                <li><a href="#" className="hover:text-gray-300 transition">Community Forum</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; 2024 AI-Powered Blogger. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer