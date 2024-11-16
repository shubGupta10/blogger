import React, { useState, useEffect } from 'react'
import { GENERATE_STORY } from '@/Graphql/mutations/blogMutations'
import { GenerateStoryMutation, GenerateStoryMutationVariables } from '@/gql/graphql'
import { useMutation } from '@apollo/client'
import Loader from '@/components/Loader'

interface GenerativeContentProps {
  setBlogContent: (content: string) => void
  blogTitle: string
}

export const GenerativeContent: React.FC<GenerativeContentProps> = ({
  setBlogContent,
  blogTitle
}) => {
  const [generateStory, { loading, error }] = useMutation<
    GenerateStoryMutation,
    GenerateStoryMutationVariables
  >(GENERATE_STORY)
  
  const [prompt, setPrompt] = useState("")
  const [isRateLimited, setIsRateLimited] = useState(false)

  const RATE_LIMIT_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds

  useEffect(() => {
    // Check if the user is rate-limited
    const lastRequestTime = localStorage.getItem('lastRequestTime')
    if (lastRequestTime) {
      const elapsedTime = Date.now() - parseInt(lastRequestTime)
      if (elapsedTime < RATE_LIMIT_INTERVAL) {
        setIsRateLimited(true)
      } else {
        setIsRateLimited(false)
      }
    }
  }, [])

  const beautifyContent = (content: string) => {
    const sections = content.split(/(?=#{1,6}\s)/)
    return sections.map(section => {
      return section
        // Headers transformation
        .replace(/#{6}\s+(.+)$/gm, '<h6><strong>$1</strong></h6>')
        .replace(/#{5}\s+(.+)$/gm, '<h5><strong>$1</strong></h5>')
        .replace(/#{4}\s+(.+)$/gm, '<h4><strong>$1</strong></h4>')
        .replace(/#{3}\s+(.+)$/gm, '<h3><strong>$1</strong></h3>')
        .replace(/#{2}\s+(.+)$/gm, '<h2><strong>$1</strong></h2>')
        .replace(/#{1}\s+(.+)$/gm, '<h1><strong>$1</strong></h1>')

        // Text styling
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')

        // List formatting
        .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
        .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
        .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')

        // Paragraph and spacing
        .replace(/\n\s*\n/g, '</p><p>')
        .replace(/([^>])\n([^<])/g, '$1<br>$2')
        .replace(/^(?!<[h|u|p|l])[^<](.+?)(?!<\/)$/gm, '<p>$1</p>')

        // Cleanup and optimization
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/<p><br><\/p>/g, '')
        .replace(/(<br>)+/g, '<br>')
        .replace(/(<p>)+/g, '<p>')
        .replace(/(<\/p>)+/g, '</p>')
    }).join('\n')
  }

  const generateImprovedPrompt = (title: string) => {
    return `Create a comprehensive and engaging blog post about "${title}" following this structure:...`
  }

  const handleGenerateStory = async () => {
    if (!prompt.trim() || isRateLimited) return

    try {
      const result = await generateStory({
        variables: { prompt }
      })

      if (result.data?.generateStory) {
        const formattedContent = beautifyContent(result.data.generateStory)
        setBlogContent(formattedContent)

        // Set the current time in localStorage
        localStorage.setItem('lastRequestTime', Date.now().toString())
        setIsRateLimited(true)
        
        // Optionally, you can reset rate-limiting after the timeout
        setTimeout(() => {
          setIsRateLimited(false)
        }, RATE_LIMIT_INTERVAL)
      }
    } catch (err) {
      console.error("Error generating story:", err)
    }
  }

  const handleUseBlogTitle = () => {
    if (blogTitle) {
      const improvedPrompt = generateImprovedPrompt(blogTitle)
      setPrompt(improvedPrompt)
    }
  }

  return (
    <div className="mb-6 space-y-4">
      {/* UI components */}
      <button
        onClick={handleGenerateStory}
        disabled={loading || isRateLimited || !prompt.trim()}
        className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black 
                  rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 
                  transition-colors duration-200 disabled:bg-gray-400 
                  disabled:cursor-not-allowed flex-1 sm:flex-none"
      >
        {loading ? 'Generating...' : 'Generate Content'}
      </button>
      {isRateLimited && (
        <div className="mt-2 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100 rounded-lg">
          Please wait 5 minutes before generating new content.
        </div>
      )}
      {error && <div className="mt-2 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">Error: {error.message}</div>}
    </div>
  )
}

export default GenerativeContent
