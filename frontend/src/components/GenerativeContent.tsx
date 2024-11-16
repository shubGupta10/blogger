import React, { useState } from 'react'
import { GENERATE_STORY } from '@/Graphql/mutations/blogMutations'
import { 
  GenerateStoryMutation, 
  GenerateStoryMutationVariables 
} from '@/gql/graphql'
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
  const [lastGenerated, setLastGenerated] = useState<number | null>(null)

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
    return `Create a comprehensive and engaging blog post about "${title}" following this structure:

Introduction:
- Hook the reader with a compelling opening statement
- Provide context and relevance of the topic
- Outline what readers will learn (3-4 key takeaways)

Main Content (4-5 sections):
- Break down complex concepts into digestible sections
- Use clear examples and real-world applications
- Include relevant statistics or expert opinions when applicable
- Demonstrate practical implementation steps where relevant
- Address common questions or challenges
- If technical, include code examples with proper formatting (use \\language for code blocks)

Interactivity Elements:
- Include thought-provoking questions
- Add actionable tips and best practices
- Provide troubleshooting guidance if applicable

Conclusion:
- Summarize key points
- Provide next steps or implementation guidance
- End with a call-to-action or thought-provoking statement

Style Guidelines:
- Write in a conversational yet professional tone
- Use active voice and clear language
- Keep paragraphs concise (3-4 sentences max)
- Include subheadings for better readability
- Use bullet points for lists
- Highlight important concepts in **bold**
- Target length: 1500-2000 words

Additional Requirements:
- Include relevant examples and use cases
- Address potential challenges and solutions
- Provide actionable takeaways
- Maintain consistent formatting throughout
- Use industry-standard terminology when applicable`
  }

  const handleGenerateStory = async () => {
    const currentTime = Date.now()

    // Rate limiting: Allow only one prompt every 5 minutes (300,000 ms)
    if (lastGenerated && currentTime - lastGenerated < 300000) {
      alert("You can only generate a new prompt every 5 minutes.")
      return
    }
    if (!prompt.trim()) return
    
    try {
      const result = await generateStory({
        variables: { prompt }
      })

      if (result.data?.generateStory) {
        const formattedContent = beautifyContent(result.data.generateStory)
        setBlogContent(formattedContent)
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

  const promptPlaceholder = `Enter your blog post requirements...

Key Elements to Specify:
• Target audience and their expertise level
• Main topics and subtopics to cover
• Desired tone (technical, casual, professional)
• Specific examples or case studies to include
• Preferred content structure
• Any specific technologies or concepts to focus on`

return (
  <div className="mb-6 space-y-4">
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">
        AI-Powered Blog Content Generator
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Generate well-structured, engaging blog content with AI assistance
      </p>
    </div>

    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder={promptPlaceholder}
      className="w-full p-4 border border-gray-300 dark:border-gray-700 
                rounded-lg resize-y min-h-[200px] 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                transition-all duration-200"
    />

    <div className="flex gap-4 flex-col sm:flex-row">
      <button
        onClick={handleGenerateStory}
        className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black 
                  rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 
                  transition-colors duration-200 disabled:bg-gray-400 
                  disabled:cursor-not-allowed flex-1 sm:flex-none"
        disabled={loading || !prompt.trim()}
      >
        {loading ? 'Generating...' : 'Generate Content'}
      </button>

      <button
        onClick={handleUseBlogTitle}
        className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black 
                  rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 
                  transition-colors duration-200 disabled:bg-gray-400 
                  disabled:cursor-not-allowed flex-1 sm:flex-none"
        disabled={!blogTitle}
      >
        Use Blog Title
      </button>
    </div>

    {loading && <Loader />}
    {error && (
      <div className="mt-2 p-3 bg-red-100 dark:bg-red-900 
                    text-red-700 dark:text-red-100 rounded-lg">
        Error: {error.message}
      </div>
    )}
  </div>
)
}

export default GenerativeContent