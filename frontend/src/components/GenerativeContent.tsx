import React, { useState } from 'react';
import { GENERATE_STORY } from '@/Graphql/mutations/blogMutations';
import { GenerateStoryMutation, GenerateStoryMutationVariables } from '@/gql/graphql';
import { useMutation } from '@apollo/client';
import Loader from '@/components/Loader';

interface GenerativeContentProps {
  setBlogContent: (content: string) => void;
}

export const GenerativeContent: React.FC<GenerativeContentProps> = ({ setBlogContent }) => {
  const [generateStory, { loading, error }] = useMutation<GenerateStoryMutation, GenerateStoryMutationVariables>(GENERATE_STORY);
  const [prompt, setPrompt] = useState("");

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

  const beautifyContent = (content: string) => {
    return content
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.+)$/gm, '<p>$1</p>');
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Use AI to generate your blog post</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt for the blog..."
        className="w-full p-2 mb-2 border border-gray-300 rounded resize-y min-h-[100px]"
      />
      <button
        onClick={handleGenerateStory}
        className="px-4 py-2 bg-black text-white rounded cursor-pointer hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading || !prompt.trim()}
      >
        {loading ? 'Generating...' : 'Generate Response'}
      </button>
      {loading && <Loader />}
      {error && (
        <p className="mt-2 text-red-600">
          Error: {error.message}
        </p>
      )}
    </div>
  );
};

export default GenerativeContent;