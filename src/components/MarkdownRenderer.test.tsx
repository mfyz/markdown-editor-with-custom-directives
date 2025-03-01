import { render, screen } from '@testing-library/react'
import MarkdownRenderer from './MarkdownRenderer'

describe('MarkdownRenderer', () => {
  it('renders basic markdown content', () => {
    render(<MarkdownRenderer content="# Heading 1\n\nThis is a paragraph." />)

    // Check heading
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    // The text content might include the paragraph due to how the HTML is rendered
    expect(heading.textContent).toContain('Heading 1')
    expect(heading.tagName).toBe('H1')

    // Check paragraph
    const paragraph = screen.getByText(/This is a paragraph/i)
    expect(paragraph).toBeInTheDocument()
  })

  it('renders links correctly', () => {
    render(
      <MarkdownRenderer content="This is a [link](https://example.com)." />
    )

    const link = screen.getByText('link')
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', 'https://example.com')
    // Note: The target and rel attributes might not be present depending on the marked configuration
  })

  it('renders bold and italic text correctly', () => {
    render(<MarkdownRenderer content="This is **bold** and *italic* text." />)

    // Check bold text
    const boldText = screen.getByText('bold')
    expect(boldText).toBeInTheDocument()
    expect(boldText.tagName).toBe('STRONG')

    // Check italic text
    const italicText = screen.getByText('italic')
    expect(italicText).toBeInTheDocument()
    expect(italicText.tagName).toBe('EM')
  })

  it('renders code content correctly', () => {
    render(<MarkdownRenderer content="This is code: `const x = 1;`" />)

    // Find code content
    const codeElement = screen.getByText('const x = 1;')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement.tagName).toBe('CODE')
  })

  it('renders inline code correctly', () => {
    render(<MarkdownRenderer content="This is `inline code`." />)

    const inlineCode = screen.getByText('inline code')
    expect(inlineCode).toBeInTheDocument()
    expect(inlineCode.tagName).toBe('CODE')
  })

  it('renders unordered list items', () => {
    render(<MarkdownRenderer content="- Item 1\n- Item 2" />)

    // Check for list items by using a more flexible approach
    const listItems = document.querySelectorAll('li')
    expect(listItems.length).toBeGreaterThan(0)

    // Check that the content contains our list items
    const rendererDiv = document.querySelector('.markdown-renderer')
    expect(rendererDiv?.textContent).toContain('Item 1')
    expect(rendererDiv?.textContent).toContain('Item 2')
  })

  it('renders ordered list items', () => {
    render(<MarkdownRenderer content="1. First\n2. Second" />)

    // Check for ordered list
    const orderedList = document.querySelector('ol')
    expect(orderedList).toBeInTheDocument()

    // Check that the content contains our list items
    const rendererDiv = document.querySelector('.markdown-renderer')
    expect(rendererDiv?.textContent).toContain('First')
    expect(rendererDiv?.textContent).toContain('Second')
  })

  it('renders blockquotes correctly', () => {
    render(<MarkdownRenderer content="> This is a blockquote." />)

    const blockquote = document.querySelector('blockquote')
    expect(blockquote).toBeInTheDocument()
    expect(blockquote?.textContent).toContain('This is a blockquote')
  })

  it('renders color directive correctly', () => {
    render(
      <MarkdownRenderer content="This has :color[colored text]{#ff0000}." />
    )

    // Check for the specific span with color styling
    const colorSpan = document.querySelector('.text-color-directive')
    expect(colorSpan).toBeInTheDocument()
    expect(colorSpan?.textContent).toBe('colored text')
    expect(colorSpan).toHaveAttribute('style', 'color: #ff0000')
    expect(colorSpan).toHaveAttribute('data-type', 'color-directive')
  })

  it('renders button directive correctly', () => {
    render(
      <MarkdownRenderer
        content={
          'Click this :button[Button]{url="https://example.com" shape="pill" color="blue"}.'
        }
      />
    )

    // Check for the specific button link with all attributes
    const buttonLink = document.querySelector('.button-directive')
    expect(buttonLink).toBeInTheDocument()
    expect(buttonLink?.textContent).toBe('Button')
    expect(buttonLink).toHaveAttribute('href', 'https://example.com')
    expect(buttonLink).toHaveAttribute('data-type', 'button-directive')
    expect(buttonLink).toHaveClass('shape-pill')
    expect(buttonLink).toHaveClass('color-blue')
  })

  it('renders button directive with default values when attributes are missing', () => {
    render(
      <MarkdownRenderer content={'Click this :button[Simple Button]{}.'} />
    )

    // Check for the button with default attributes
    const buttonLink = document.querySelector('.button-directive')
    expect(buttonLink).toBeInTheDocument()
    expect(buttonLink?.textContent).toBe('Simple Button')
    expect(buttonLink).toHaveAttribute('href', '#')
    expect(buttonLink).toHaveClass('shape-pill')
    expect(buttonLink).toHaveClass('color-blue')
  })

  it('renders multiple directives correctly', () => {
    render(
      <MarkdownRenderer
        content={`
# Test Document

This has :color[colored text]{#ff0000}.

Click this :button[Button]{url="https://example.com" shape="pill" color="blue"}.

This has a [link](https://example.org) and **bold** text.
        `}
      />
    )

    // Check for heading
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toContain('Test Document')

    // Check for color directive
    const colorSpan = document.querySelector('.text-color-directive')
    expect(colorSpan).toBeInTheDocument()
    expect(colorSpan?.textContent).toBe('colored text')
    expect(colorSpan).toHaveAttribute('style', 'color: #ff0000')

    // Check for button directive
    const buttonLink = document.querySelector('.button-directive')
    expect(buttonLink).toBeInTheDocument()
    expect(buttonLink?.textContent).toBe('Button')
    expect(buttonLink).toHaveAttribute('href', 'https://example.com')

    // Check for regular link
    const link = screen.getByText('link')
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', 'https://example.org')

    // Check for bold text
    const boldText = screen.getByText('bold')
    expect(boldText).toBeInTheDocument()
    expect(boldText.tagName).toBe('STRONG')
  })

  it('handles empty content', () => {
    render(<MarkdownRenderer content="" />)

    // Just checking that it renders without errors
    const renderer = document.querySelector('.markdown-renderer')
    expect(renderer).toBeInTheDocument()
  })

  it('sanitizes HTML to prevent XSS attacks', () => {
    render(
      <MarkdownRenderer
        content={
          '<script>alert("XSS")</script><img src="x" onerror="alert(\'XSS\')">'
        }
      />
    )

    // The script tag should be removed
    expect(document.querySelector('script')).not.toBeInTheDocument()

    // The img tag should be present but without the onerror attribute
    const img = document.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'x')
    expect(img).not.toHaveAttribute('onerror')
  })
})
