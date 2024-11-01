'use client'

import React, { useState, useRef } from 'react'
import { AddContactData, uploadImage } from '@/Firebase/FirebaseContact'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Upload, X, User, Mail, MessageSquare, Send, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')

    try {
      let imageUrl = ''
      if (image) {
        imageUrl = await uploadImage(image)
      }

      const userData = {
        name,
        email,
        Image: imageUrl,
        message,
      }

      await AddContactData(userData)
      toast.success('Message sent successfully!')
      setSuccessMessage('Your message has been sent. We\'ll get back to you soon!')
      
      setName('')
      setEmail('')
      setMessage('')
      setImage(null)
    } catch (error) {
      console.error("Error submitting contact data: ", error)
      toast.error('Failed to send message. Please try again.')
      setSuccessMessage('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const handleIconClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full space-y-8 bg-white dark:bg-black p-10 rounded-xl shadow-lg"
      >
        <div>
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Get in Touch</h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-300">We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className=" text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </label>
              <Input 
                id="name"
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              />
            </div>
            <div>
              <label htmlFor="email" className=" text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className=" text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Message
            </label>
            <Textarea 
              id="message"
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required 
              className="mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              rows={4}
            />
          </div>
          <div>
            <label htmlFor="file" className=" text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Upload Media (Optional)
            </label>
            <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {image ? (
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{image.name}</p>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload
                      className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300 cursor-pointer"
                      onClick={handleIconClick}
                    />
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
                <input 
                  ref={fileInputRef}
                  id="file" 
                  name="file" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </div>
            </div>
          </div>
          <div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-black" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-md ${
              successMessage.includes('Failed') 
                ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' 
                : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
            }`}
          >
            {successMessage}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}