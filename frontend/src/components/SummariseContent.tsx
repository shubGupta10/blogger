'use client'
import React, { useState } from 'react';
import { GENERATE_STORY } from '@/Graphql/mutations/blogMutations';
import { GenerateStoryMutation, GenerateStoryMutationVariables } from '@/gql/graphql';
import { useMutation } from '@apollo/client';
import { Button } from './ui/button';

interface SummariseContentProps {
    setBlogContent: (content: string) => void;
    prompt: string; 
}

const SummariseContent: React.FC<SummariseContentProps> = ({ setBlogContent, prompt }) => {
    const [generateStory, { loading, error }] = useMutation<GenerateStoryMutation, GenerateStoryMutationVariables>(GENERATE_STORY);

    const beautifyContent = (content: string) => {
        return content
            .trim()
            .replace(/###### (.+)$/gm, '<h6>$1</h6>')
            .replace(/##### (.+)$/gm, '<h5>$1</h5>')
            .replace(/#### (.+)$/gm, '<h4>$1</h4>')
            .replace(/### (.+)$/gm, '<h3>$1</h3>')
            .replace(/## (.+)$/gm, '<h2>$1</h2>')
            .replace(/# (.+)$/gm, '<h1>$1</h1>')
            
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') 
            .replace(/\*(.+?)\*/g, '<em>$1</em>') 
    
            .replace(/^- (.+)$/gm, '<li>$1</li>') 
            .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>') 
    
            .replace(/\n\s*\n/g, '</p><p>')
            .replace(/\n/g, '<br>') 
    
            .replace(/^(?!<h[1-6]>|<li>|<\/ul>|<\/ol>)(.+)$/gm, '<p>$1</p>')
    
            .replace(/<p><br><\/p>/g, '') 
            .replace(/<p><\/p>/g, ''); 
    };
    
    

    const handleSummariseButton = async () => {

        if (!prompt.trim()) return;
        try {
            const response = await generateStory({
                variables: { prompt },
            });

            if (response.data?.generateStory) {
                const formattedContent = beautifyContent(response.data.generateStory);
                setBlogContent(formattedContent);
            }
        } catch (error: any) {
            console.error("Error generating story:", error);
        }
    };

    return (
        <div>
            <div>
                <Button onClick={handleSummariseButton} disabled={loading}>
                    {loading ? "Summarising..." : "Click here to Summarise"}
                </Button>
            </div>
            {error && <p>Error: {error.message}</p>}
        </div>
    );
};

export default SummariseContent;
