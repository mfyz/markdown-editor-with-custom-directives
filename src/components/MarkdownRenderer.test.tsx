import { render, screen } from '@testing-library/react'
import MarkdownRenderer from './MarkdownRenderer'

describe('MarkdownRenderer', () => {
  it('renders basic markdown content', () => {
    render(<MarkdownRenderer content="# Heading 1\n\nThis is a paragraph." />)

    // Use a more flexible text matching approach
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toContain('Heading 1')

    const paragraph = screen.getByText(content =>
      content.includes('This is a paragraph')
    )
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
  })

  it('renders color directive correctly', () => {
    render(
      <MarkdownRenderer content="This has :color[colored text]{#ff0000}." />
    )

    // Use a more flexible approach to find the colored text
    const paragraph = screen.getByText(content => content.includes('This has'))
    expect(paragraph).toBeInTheDocument()

    // Check that the HTML structure contains the expected elements
    expect(document.querySelector('.text-color-directive')).toBeInTheDocument()
  })

  it('renders button directive correctly', () => {
    render(
      <MarkdownRenderer
        content={
          'Click this :button[Button]{url="https://example.com" shape="pill" color="blue"}.'
        }
      />
    )

    // Use a more flexible approach to find the button
    const paragraph = screen.getByText(content =>
      content.includes('Click this')
    )
    expect(paragraph).toBeInTheDocument()

    // Check that the HTML structure contains the expected elements
    const buttonLink = document.querySelector('.button-directive')
    expect(buttonLink).toBeInTheDocument()
    expect(buttonLink).toHaveAttribute('href', 'https://example.com')
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
        `}
      />
    )

    // Check for heading
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toContain('Test Document')

    // Check for color directive
    expect(document.querySelector('.text-color-directive')).toBeInTheDocument()

    // Check for button directive
    expect(document.querySelector('.button-directive')).toBeInTheDocument()
  })

  it('handles empty content', () => {
    render(<MarkdownRenderer content="" />)

    // Just checking that it renders without errors
    expect(document.querySelector('.markdown-renderer')).toBeInTheDocument()
  })
})
