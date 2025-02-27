import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Strike from '@tiptap/extension-strike'
import { useState, useEffect, useRef } from 'react'
import TurndownService from 'turndown'
import { marked } from 'marked'
import './MarkdownEditor.css'
import EditorToolbar from './EditorToolbar'

interface MarkdownEditorProps {
  initialContent?: string
  onChange?: (markdown: string) => void
  placeholder?: string
}

const MarkdownEditor = ({
  initialContent = '',
  onChange,
  placeholder = 'Write something...'
}: MarkdownEditorProps) => {
  const [markdown, setMarkdown] = useState(initialContent)
  const [turndownService] = useState(() => new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*'
  }))
  
  // Reference to track if the update is coming from the source editor
  const updatingFromSource = useRef(false);

  // Convert initial markdown to HTML for the editor
  const initialHtml = marked(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false
      }),
      TextStyle,
      Color,
      Strike
    ],
    content: initialHtml,
    onUpdate: ({ editor }) => {
      if (updatingFromSource.current) {
        updatingFromSource.current = false;
        return;
      }
      
      const html = editor.getHTML()
      const md = turndownService.turndown(html)
      setMarkdown(md)
      onChange?.(md)
    },
    editorProps: {
      attributes: {
        class: 'markdown-editor-content',
        placeholder
      }
    }
  })

  // Configure turndown service
  useEffect(() => {
    // Add rules for underline
    turndownService.addRule('underline', {
      filter: ['u'],
      replacement: content => `<u>${content}</u>`
    })

    // Add rules for strikethrough if needed
    turndownService.addRule('strikethrough', {
      filter: ['s', 'strike', 'del'],
      replacement: content => `~~${content}~~`
    })
  }, [turndownService])

  // Handle source markdown changes
  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMarkdown = e.target.value;
    setMarkdown(newMarkdown);
    
    // Update the editor content
    if (editor) {
      updatingFromSource.current = true;
      
      // Convert markdown to HTML using marked
      const html = marked(newMarkdown);
      editor.commands.setContent(html);
    }
    
    onChange?.(newMarkdown);
  };

  return (
    <div className="markdown-editor-container">
      <div className="source-editor">
        <div className="editor-header">
          <h3>Markdown Source</h3>
        </div>
        <textarea
          className="markdown-source"
          value={markdown}
          onChange={handleSourceChange}
          placeholder={placeholder}
        />
      </div>
      <div className="rich-editor">
        <div className="editor-header">
          <h3>Rich Editor</h3>
        </div>
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default MarkdownEditor
