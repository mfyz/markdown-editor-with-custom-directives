import { render } from '@testing-library/react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ButtonDirectiveExtension } from './ButtonDirectiveExtension'

// Mock component to test the extension
const TestEditor = ({ content }: { content: string }) => {
  const editor = useEditor({
    extensions: [StarterKit, ButtonDirectiveExtension],
    content
  })

  return <EditorContent editor={editor} />
}

describe('ButtonDirectiveExtension', () => {
  it('renders without crashing', () => {
    render(
      <TestEditor content="Test :button[Click me]{url=https://example.com shape=pill color=blue} text" />
    )
    // Just testing that it renders without errors
  })
})
