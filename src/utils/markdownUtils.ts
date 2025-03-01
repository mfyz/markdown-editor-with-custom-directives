import { marked } from 'marked'
import type { Renderer } from 'marked'

// Helper function to parse attributes from a string
export function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {}

  // Match key=value pairs, handling spaces properly
  const attrRegex = /(\w+)=([^\s]+|"[^"]*")/g
  let match

  while ((match = attrRegex.exec(attrString)) !== null) {
    const key = match[1]
    let value = match[2]

    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1)
    }

    attrs[key] = value
  }

  return attrs
}

// Configure marked with custom renderers and extensions
export function configureMarked(): typeof marked {
  // Reset to default options
  marked.setOptions({
    gfm: true,
    breaks: true
  })

  // Add custom renderer for color directives
  const renderer: Partial<Renderer> = {
    text(token) {
      // Replace color directives with styled spans
      let processedText = token.text.replace(
        /:color\[(.*?)\]\{(#[0-9a-fA-F]{3,8}|[a-zA-Z]+)\}/g,
        (_, content, color) =>
          `<span class="text-color-directive" style="color: ${color}" data-type="color-directive">${content}</span>`
      )

      // Keep button directives as-is for the extension to handle
      return processedText
    }
  }

  marked.use({ renderer })

  // Add custom handler for button-directive elements
  marked.use({
    extensions: [
      {
        name: 'button-directive',
        level: 'inline',
        start(src) {
          return src.match(/:button\[/)?.index
        },
        tokenizer(src) {
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
        renderer(token) {
          const attrs = parseAttributes(token.attrs)
          const url = attrs.url || '#'
          const shape = attrs.shape || 'pill'
          const color = attrs.color || 'blue'

          return `<a class="button-directive shape-${shape} color-${color}" href="${url}" data-type="button-directive">${token.text}</a>`
        }
      }
    ]
  })

  return marked
}

// Export a pre-configured marked instance
export const configuredMarked = configureMarked()
