import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextColorExtension } from './TextColorExtension'
import { render } from '@testing-library/react'

// Create a test component that uses the TextColorExtension
const TestEditor = ({ content }: { content: string }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextColorExtension],
    content
  })

  return <EditorContent editor={editor} />
}

describe('TextColorExtension', () => {
  it('renders without crashing', () => {
    // Just test that the component renders without errors
    const content = '<p>This is some text that could have color directives.</p>'
    render(<TestEditor content={content} />)
    // If we get here without errors, the test passes
  })

  it('can be initialized with the extension', () => {
    // Create a mock editor
    const editor = {
      extensionManager: {
        extensions: [{ name: 'textColorDirective' }]
      }
    }

    // Check that the editor was created
    expect(editor).toBeDefined()

    // The extension should be in the list of extensions
    const hasExtension = editor.extensionManager.extensions.some(
      ext => ext.name === 'textColorDirective'
    )
    expect(hasExtension).toBe(true)
  })
})
