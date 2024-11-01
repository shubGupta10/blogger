import React, { useState } from 'react';
import { GENERATE_STORY } from '@/Graphql/mutations/blogMutations';
import { GenerateStoryMutation, GenerateStoryMutationVariables } from '@/gql/graphql';
import { useMutation } from '@apollo/client';
import Loader from '@/components/Loader';

interface GenerativeContentProps {
  setBlogContent: (content: string) => void;
  blogTitle: string;
}

export const GenerativeContent: React.FC<GenerativeContentProps> = ({ setBlogContent, blogTitle }) => {
  const [generateStory, { loading, error }] = useMutation<GenerateStoryMutation, GenerateStoryMutationVariables>(GENERATE_STORY);
  const [prompt, setPrompt] = useState("");

  const beautifyContent = (content: string) => {
    // First, split content into sections
    const sections = content.split(/(?=#{1,6}\s)/);

    // Process each section
    return sections.map(section => {
      return section
        // Headers
        .replace(/#{6}\s+(.+)$/gm, '<h6>$1</h6>')
        .replace(/#{5}\s+(.+)$/gm, '<h5>$1</h5>')
        .replace(/#{4}\s+(.+)$/gm, '<h4>$1</h4>')
        .replace(/#{3}\s+(.+)$/gm, '<h3>$1</h3>')
        .replace(/#{2}\s+(.+)$/gm, '<h2>$1</h2>')
        .replace(/#{1}\s+(.+)$/gm, '<h1>$1</h1>')

        // Text formatting
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')

        // Lists
        .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
        .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
        .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')

        // Paragraphs and line breaks
        .replace(/\n\s*\n/g, '</p><p>')
        .replace(/([^>])\n([^<])/g, '$1<br>$2')

        // Wrap non-tagged text in paragraphs
        .replace(/^(?!<[h|u|p|l])[^<](.+?)(?!<\/)$/gm, '<p>$1</p>')

        // Clean up
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/<p><br><\/p>/g, '')
        .replace(/(<br>)+/g, '<br>')
        .replace(/(<p>)+/g, '<p>')
        .replace(/(<\/p>)+/g, '</p>');
    }).join('\n');
  };

  const generateImprovedPrompt = (title: string) => {
    return `Write a detailed, well-structured blog post on "${title}" with the following guidelines:
  
  1. Start with an engaging introduction that captures the reader's attention.
  2. Use clear and logical section titles to organize the content.
  3. Include relevant details, examples, and insights to support each section.
  4. Maintain a mix of short and medium-length paragraphs to improve readability.
  5. End with a memorable, impactful closing statement.
  
  Formatting instructions:
  - Use simple, clean formatting with distinct headings and subheadings.
  - **For any code snippets, use markdown formatting** to clearly display the code. Avoid JSON formatting outside code blocks.
  - Apply code blocks with syntax highlighting, like \`\`\`json or \`\`\`javascript, for each programming language used.
  - Ensure good spacing between sections for readability and smooth transitions between paragraphs.
  
  Style: Professional but conversational and engaging.
  Length: Target approximately 1000 words.
  Structure: Aim for 4-6 main sections for a comprehensive yet accessible guide.`;
  };
  

  
  

  const handleGenerateStory = async () => {
    if (!prompt.trim()) return;
    try {
      const result = await generateStory({
        variables: { prompt },
      });

      if (result.data?.generateStory) {
        const formattedContent = beautifyContent(result.data.generateStory);
        setBlogContent(formattedContent);
      }
    } catch (err) {
      console.error("Error generating story:", err);
    }
  };

  const handleUseBlogTitle = () => {
    if (blogTitle) {
      const improvedPrompt = generateImprovedPrompt(blogTitle);
      setPrompt(improvedPrompt);
    }
  };

  const promptPlaceholder = `Enter your prompt for the blog...

Tip: For better results, be specific about:
- Main topics to cover
- Desired tone (formal, casual, technical)
- Key points to include
- Preferred structure
- Target audience`;

  return (
    <div className="mb-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Use AI to generate your blog post</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Let AI help you create well-structured, engaging content for your blog
        </p>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={promptPlaceholder}
        className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg resize-y min-h-[200px] 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />

      <div className='flex gap-4 flex-col sm:flex-row'>
        <button
          onClick={handleGenerateStory}
          className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full
                   hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200
                   disabled:bg-gray-400 disabled:cursor-not-allowed flex-1 sm:flex-none"
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'Generating...' : 'Generate Response'}
        </button>

        <button
          onClick={handleUseBlogTitle}
          className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full
                   hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200
                   disabled:bg-gray-400 disabled:cursor-not-allowed flex-1 sm:flex-none"
          disabled={!blogTitle}
        >
          Use Blog Title
        </button>
      </div>

      {loading && <Loader />}
      {error && (
        <div className="mt-2 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
          Error: {error.message}
        </div>
      )}
    </div>
  );
};

export default GenerativeContent;