import React, { useEffect, useState } from 'react'
import { marked } from 'marked'
import '../extensions/TextColorExtension.css'
import '../extensions/ButtonDirectiveExtension.css'
import './MarkdownRenderer.css'

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
    // Configure marked to handle custom directives
    const renderer: Partial<typeof marked.Renderer.prototype> = {
      text(token: any) {
        // Get the text from the token
        const text = typeof token === 'string' ? token : token.text || ''

        // Handle color directive
        let processedText = text.replace(
          /:color\[(.*?)\]\{(#[0-9a-fA-F]{3,8}|[a-zA-Z]+)\}/g,
          (_: string, content: string, color: string) =>
            `<span class="text-color-directive" style="color: ${color}" data-type="color-directive">${content}</span>`
        )

        return processedText
      }
    }

    marked.use({ renderer })

    // Add custom tokenizer for button directive
    marked.use({
      extensions: [
        {
          name: 'button-directive',
          level: 'inline',
          start(src: string) {
            return src.match(/:button\[/)?.index
          },
          tokenizer(src: string) {
            const rule = /^:button\[(.*?)\]\{(.*?)\}/
            const match = rule.exec(src)
            if (match) {
              return {
                type: 'button-directive',
                raw: match[0],
                text: match[1],
                attrs: match[2]
              }
            }
            return undefined
          },
          renderer(token: any) {
            // Parse attributes
            const attrs: Record<string, string> = {}
            const attrRegex = /(\w+)=([^\s]+|"[^"]*")/g
            let attrMatch

            while ((attrMatch = attrRegex.exec(token.attrs)) !== null) {
              const key = attrMatch[1]
              let value = attrMatch[2]

              // Remove quotes if present
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1)
              }

              attrs[key] = value
            }

            const url = attrs.url || '#'
            const shape = attrs.shape || 'pill'
            const color = attrs.color || 'blue'

            return `<a class="button-directive shape-${shape} color-${color}" href="${url}" data-type="button-directive">${token.text}</a>`
          }
        }
      ]
    })

    // Render the markdown content
    const html = marked.parse(content)
    if (typeof html === 'string') {
      setRenderedHtml(html)
    } else {
      html.then(result => setRenderedHtml(result))
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
