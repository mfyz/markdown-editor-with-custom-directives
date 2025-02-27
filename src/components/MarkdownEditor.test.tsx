import { render, screen } from '@testing-library/react'
import MarkdownEditor from './MarkdownEditor'

// Mock TipTap editor
jest.mock('@tiptap/react', () => ({
  useEditor: () => ({
    chain: () => ({
      focus: () => ({
        toggleBold: () => ({
          run: jest.fn()
        })
      })
    }),
    isActive: jest.fn().mockReturnValue(false)
  }),
  EditorContent: ({}: { editor: any }) => (
    <div data-testid="editor-content">Editor Content</div>
  )
}))

describe('MarkdownEditor', () => {
  it('renders the editor', () => {
    render(<MarkdownEditor />)
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })

  it('renders with initial content', () => {
    render(<MarkdownEditor initialContent="# Test Content" />)
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<MarkdownEditor placeholder="Test Placeholder" />)
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })
})
