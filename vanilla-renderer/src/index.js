/**
 * VanillaJS Markdown Renderer with Custom Directives
 * Zero dependencies, slim implementation
 */

class MarkdownRenderer {
  static PATTERNS = {
    // Basic markdown
    bold: /\*\*(.*?)\*\*/g,
    italic: /\*(.*?)\*/g,
    strike: /~~(.*?)~~/g,
    link: /\[(.*?)\]\((.*?)\)/g,
    // Headlines
    h6: /^#{6}\s+(.+)$/gm,
    h5: /^#{5}\s+(.+)$/gm,
    h4: /^#{4}\s+(.+)$/gm,
    h3: /^#{3}\s+(.+)$/gm,
    h2: /^#{2}\s+(.+)$/gm,
    h1: /^#\s+(.+)$/gm,
    // Lists
    ul: /^[\s]*[-*]\s+(.+)$/gm,
    // Line breaks
    lineBreak: /\n/g,

    // Custom directives
    color: /:color\[(.*?)\]{(.*?)}/g,
    button: /:button\[(.*?)\]{(.*?)}/g
  }

  static BUTTON_STYLES = {
    shapes: {
      pill: 'border-radius:9999px',
      rect: 'border-radius:4px',
      rounded: 'border-radius:8px'
    },
    colors: {
      purple: 'background-color:#6366f1',
      blue: 'background-color:#3b82f6',
      green: 'background-color:#22c55e',
      red: 'background-color:#ef4444',
      yellow: 'background-color:#eab308',
      gray: 'background-color:#6b7280'
    },
    base: [
      'display:inline-block',
      'text-decoration:none',
      'padding:8px 16px',
      'cursor:pointer',
      'color:white'
    ].join(';')
  }

  /**
   * Parse button parameters from the parameter string
   * @param {string} params - Parameter string (e.g., "url=https://example.com shape=pill color=blue")
   * @returns {Object} Parsed parameters
   */
  static parseButtonParams(params) {
    const result = {
      url: '',
      shape: 'rounded',
      color: 'blue'
    }

    params.split(' ').forEach(param => {
      const [key, value] = param.split('=')
      if (key && value) {
        result[key] = value
      }
    })

    return result
  }

  /**
   * Process basic markdown syntax
   * @param {string} text
   * @returns {string}
   */
  static processBasicMarkdown(text) {
    return text
      .replace(this.PATTERNS.bold, '<strong>$1</strong>')
      .replace(this.PATTERNS.italic, '<em>$1</em>')
      .replace(this.PATTERNS.strike, '<del>$1</del>')
      .replace(this.PATTERNS.link, '<a href="$2">$1</a>')
  }

  /**
   * Process color directive
   * @param {string} text
   * @returns {string}
   */
  static processColorDirective(text) {
    return text.replace(this.PATTERNS.color, (match, content, color) => {
      return `<span style="color:${color}">${content}</span>`
    })
  }

  /**
   * Process button directive
   * @param {string} text
   * @returns {string}
   */
  static processButtonDirective(text) {
    return text.replace(this.PATTERNS.button, (match, content, params) => {
      const { url, shape, color } = this.parseButtonParams(params)

      const buttonStyle = [
        this.BUTTON_STYLES.base,
        this.BUTTON_STYLES.shapes[shape] || this.BUTTON_STYLES.shapes.rounded,
        this.BUTTON_STYLES.colors[color] || this.BUTTON_STYLES.colors.blue
      ].join(';')

      return `<a href="${url}" style="${buttonStyle}">${content}</a>`
    })
  }

  /**
   * Process headlines
   * @param {string} text
   * @returns {string}
   */
  static processHeadlines(text) {
    // Process headlines and mark them for line break handling
    return text
      .replace(this.PATTERNS.h6, '<h6>$1</h6>__HEADLINE_MARKER__')
      .replace(this.PATTERNS.h5, '<h5>$1</h5>__HEADLINE_MARKER__')
      .replace(this.PATTERNS.h4, '<h4>$1</h4>__HEADLINE_MARKER__')
      .replace(this.PATTERNS.h3, '<h3>$1</h3>__HEADLINE_MARKER__')
      .replace(this.PATTERNS.h2, '<h2>$1</h2>__HEADLINE_MARKER__')
      .replace(this.PATTERNS.h1, '<h1>$1</h1>__HEADLINE_MARKER__')
  }

  /**
   * Process unordered lists
   * @param {string} text
   * @returns {string}
   */
  static processLists(text) {
    // First, identify list items and wrap them in <li> tags
    text = text.replace(this.PATTERNS.ul, '<li>$1</li>')

    // Then, group consecutive <li> elements into <ul> blocks
    const lines = text.split('\n')
    let inList = false
    let result = []

    for (let line of lines) {
      if (line.startsWith('<li>')) {
        if (!inList) {
          result.push('<ul>')
          inList = true
        }
        result.push(line)
      } else {
        if (inList) {
          result.push('</ul>')
          inList = false
        }
        result.push(line)
      }
    }

    if (inList) {
      result.push('</ul>')
    }

    // Join with newlines and clean up extra line breaks around lists
    return result
      .join('\n')
      .replace(/\n<\/ul>/g, '</ul>')
      .replace(/<ul>\n/g, '<ul>')
      .replace(/(<li>.*?<\/li>)\n(?=<li>)/g, '$1')
  }

  /**
   * Process line breaks
   * @param {string} text
   * @returns {string}
   */
  static processLineBreaks(text) {
    return (
      text
        // Handle line breaks after headlines
        .replace(
          /(__HEADLINE_MARKER__)\n+/g,
          (match, marker, offset, string) => {
            // Count the number of newlines
            const newlines = match.match(/\n/g)?.length || 0
            // If more than 2 newlines, keep the extras as <br>
            return newlines > 2 ? '<br>'.repeat(newlines - 2) : ''
          }
        )
        // Remove any remaining markers
        .replace(/__HEADLINE_MARKER__/g, '')
        // Handle regular line breaks
        .replace(/\n\n+/g, '<br><br>')
        .replace(/\n/g, '<br>')
    )
  }

  /**
   * Render markdown with custom directives
   * @param {string} markdown
   * @returns {string}
   */
  static render(markdown) {
    if (!markdown) return ''

    let html = markdown

    // Process custom directives first
    html = this.processButtonDirective(html)
    html = this.processColorDirective(html)

    // Process headlines before other markdown
    html = this.processHeadlines(html)

    // Process lists
    html = this.processLists(html)

    // Then process basic markdown
    html = this.processBasicMarkdown(html)

    // Process line breaks last
    html = this.processLineBreaks(html)

    return html
  }
}

const render = MarkdownRenderer.render.bind(MarkdownRenderer)

// Export both named and default exports
export { render }
export default MarkdownRenderer

// Support CommonJS environments
try {
  if (typeof module !== 'undefined') {
    const exports = { default: MarkdownRenderer, render }
    Object.assign(module.exports, exports)
  }
} catch {}
