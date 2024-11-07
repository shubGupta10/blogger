'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Copy, Check } from 'lucide-react'
import DOMPurify from 'dompurify'
import { Card } from '@/components/ui/card'
import { createRoot, type Root } from 'react-dom/client'

interface BlogContentProps {
  blogContent: string
}

interface CodeBlockProps {
  code: string
  language?: string
}

// Code block component with copy functionality
const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = '' }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-6 rounded-lg overflow-hidden bg-gray-950 border border-gray-800">
      {language && (
        <div className="absolute top-2 right-12 px-2 py-1 text-xs font-mono text-gray-400 bg-gray-900 rounded">
          {language}
        </div>
      )}
      
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
        aria-label="Copy code"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-sm text-gray-300">
          {code}
        </code>
      </pre>
    </div>
  )
}

const formatContent = (content: string): string => {
  // First, handle code blocks with language specification
  content = content.replace(
    /```(\w+)\n([\s\S]*?)```/g,
    (_, language, code) => `<div class="code-block" data-language="${language}">${code}</div>`
  )
  
  // Then handle code blocks without language specification
  content = content.replace(
    /```([\s\S]*?)```/g,
    (_, code) => `<div class="code-block">${code}</div>`
  )

  // Handle inline code with pink styling
  content = content.replace(
    /`([^`]+)`/g,
    '<code class="inline-code bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded font-mono text-sm">$1</code>'
  )

  // Regular text formatting rules without affecting code sections
  const formatRules = [
    { pattern: /<br>/g, replace: '\n' },
    { 
      pattern: /<h1><strong>(.*?)<\/strong><\/h1>/g,
      replace: '<h1 class="text-3xl font-bold mt-8 mb-4 bg-gradient-to-r from-blue-100 to-blue-200 bg-clip-text text-transparent">$1</h1>'
    },
    { 
      pattern: /<h3><strong>(.*?)<\/strong><\/h3>/g,
      replace: '<h3 class="text-xl font-semibold mt-6 mb-3 text-blue-200">$1</h3>'
    },
    { 
      pattern: /<p>((?!<code class="inline-code).*?)<\/p>/g, // Don't match paragraphs containing inline code
      replace: '<p class="mb-4 text-gray-300 leading-relaxed">$1</p>'
    },
    { 
      pattern: /(?<!class="inline-code[^>]*>)<strong>(.*?)<\/strong>/g, // Don't match strong tags inside inline code
      replace: '<strong class="font-semibold text-blue-300 hover:text-blue-200 transition-colors">$1</strong>'
    },
    { 
      pattern: /<p>\* /g,
      replace: '<p class="mb-2 pl-4 text-gray-300 flex items-center before:content-[\'•\'] before:mr-2 before:text-blue-400">'
    }
  ]

  return formatRules.reduce((formattedContent, rule) => {
    return formattedContent.replace(rule.pattern, rule.replace)
  }, content).trim()
}

const BlogContent: React.FC<BlogContentProps> = ({ blogContent }) => {
  const [isContentExpanded, setIsContentExpanded] = useState(false)
  const [sanitizedContent, setSanitizedContent] = useState('')
  const [codeBlockRoots, setCodeBlockRoots] = useState<Root[]>([])

  useEffect(() => {
    const formattedContent = formatContent(blogContent)
    const sanitized = DOMPurify.sanitize(formattedContent)
    setSanitizedContent(sanitized)

    return () => {
      codeBlockRoots.forEach(root => root.unmount())
    }
  }, [blogContent])

  useEffect(() => {
    codeBlockRoots.forEach(root => root.unmount())
    
    const codeBlocks = document.querySelectorAll('.code-block')
    const newRoots: Root[] = []

    codeBlocks.forEach(block => {
      const language = block.getAttribute('data-language') || ''
      const code = block.textContent || ''
      
      const container = document.createElement('div')
      block.parentNode?.replaceChild(container, block)
      
      const root = createRoot(container)
      root.render(<CodeBlock code={code} language={language} />)
      newRoots.push(root)
    })

    setCodeBlockRoots(newRoots)

    return () => {
      newRoots.forEach(root => root.unmount())
    }
  }, [sanitizedContent, isContentExpanded])

  const truncatedContent = sanitizedContent
    .split('\n')
    .slice(0, 10)
    .join('\n')

  const contentAnimationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="prose prose-invert max-w-none p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentAnimationVariants}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div 
            dangerouslySetInnerHTML={{ 
              __html: isContentExpanded ? sanitizedContent : truncatedContent 
            }} 
            className="space-y-4"
          />
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsContentExpanded(!isContentExpanded)}
          className="
            flex items-center justify-center w-full py-4 
            bg-blue-600 text-white rounded-lg font-semibold 
            transition-all duration-300 
            hover:bg-blue-700 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          "
        >
          {isContentExpanded ? 'Read Less' : 'Read More'}
          <ChevronDown 
            className={`
              ml-2 transform transition-transform duration-300
              ${isContentExpanded ? 'rotate-180' : ''}
            `}
          />
        </motion.button>
      </div>
    </Card>
  )
}

export default BlogContent