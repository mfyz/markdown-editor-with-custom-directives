import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import '../extensions/TextColorExtension.css'
import '../extensions/ButtonDirectiveExtension.css'
import './MarkdownRenderer.css'
import { configuredMarked } from '../utils/markdownUtils'

/**
 * MarkdownRenderer component for rendering markdown content with custom directives
 * This component supports the same custom directives as the MarkdownEditor
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = ''
}) => {
  const [renderedHtml, setRenderedHtml] = useState<string>('')

  useEffect(() => {
    // Render the markdown content
    try {
      const htmlResult = configuredMarked.parse(content || '')

      const processHtml = (htmlStr: string) => {
        // Sanitize the HTML to prevent XSS attacks
        return typeof DOMPurify !== 'undefined'
          ? DOMPurify.sanitize(htmlStr, {
              ADD_ATTR: [
                'target',
                'class',
                'style',
                'data-type',
                'data-shape',
                'data-color'
              ],
              ADD_TAGS: ['span']
            })
          : htmlStr
      }

      if (typeof htmlResult === 'string') {
        setRenderedHtml(processHtml(htmlResult))
      } else {
        htmlResult.then(result => {
          setRenderedHtml(processHtml(result))
        })
      }
    } catch (error) {
      console.error('Error parsing markdown:', error)
      setRenderedHtml(`<p>Error rendering markdown</p>`)
    }
  }, [content])

  return (
    <div
      className={`markdown-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  )
}

// Define the props for the MarkdownRenderer component
export interface MarkdownRendererProps {
  content: string
  className?: string
}

export default MarkdownRenderer
