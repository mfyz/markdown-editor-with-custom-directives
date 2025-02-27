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
    isActive: jest.fn().mockReturnValue(false),
    getHTML: jest.fn().mockReturnValue('<p></p>'),
    commands: {
      setContent: jest.fn()
    }
  }),
  EditorContent: ({}: { editor: any }) => (
    <div data-testid="editor-content">Editor Content</div>
  )
}))

describe('MarkdownEditor', () => {
  it('renders the editor', () => {
    render(<MarkdownEditor content="" onChange={() => {}} />)
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })

  it('renders with initial content', () => {
    render(<MarkdownEditor content="# Test Content" onChange={() => {}} />)
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(
      <MarkdownEditor
        content=""
        onChange={() => {}}
        placeholder="Test Placeholder"
      />
    )
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })
})
