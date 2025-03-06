import { marked } from 'marked'

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

  // Add custom extension for color directives
  marked.use({
    extensions: [
      {
        name: 'color-directive',
        level: 'inline',
        start(src) {
          return src.match(/:color\[/)?.index
        },
        tokenizer(src) {
          const rule = /^:color\[(.*?)\]\{(#[0-9a-fA-F]{3,8}|[a-zA-Z]+)\}/
          const match = rule.exec(src)
          if (match) {
            return {
              type: 'color-directive',
              raw: match[0],
              text: match[1],
              color: match[2]
            }
          }
          return undefined
        },
        renderer(token) {
          // Process markdown inside the color text
          const tempMarked = new marked.Renderer()
          const processedContent = marked.parseInline(token.text, {
            renderer: tempMarked
          })

          return `<span class="text-color-directive" style="color: ${token.color}" data-type="color-directive">${processedContent}</span>`
        }
      }
    ]
  })

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

          // Process markdown inside the button text
          const tempMarked = new marked.Renderer()
          const processedContent = marked.parseInline(token.text, {
            renderer: tempMarked
          })

          return `<a class="button-directive shape-${shape} color-${color}" href="${url}" data-type="button-directive">${processedContent}</a>`
        }
      }
    ]
  })

  return marked
}

// Export a pre-configured marked instance
export const configuredMarked = configureMarked()
