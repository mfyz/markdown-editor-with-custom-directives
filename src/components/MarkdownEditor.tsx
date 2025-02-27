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
  content: string
  onChange: (markdown: string) => void
  placeholder?: string
  className?: string
  allowSourceView?: boolean
}

const MarkdownEditor = ({
  content,
  onChange,
  placeholder = 'Write something...',
  className = '',
  allowSourceView = true
}: MarkdownEditorProps) => {
  const [isSourceMode, setIsSourceMode] = useState(false)
  const [turndownService] = useState(
    () =>
      new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        emDelimiter: '*'
      })
  )

  // Reference to track if the update is coming from external source
  const updatingFromExternal = useRef(false)
  // Reference to track if the update is coming from source editor
  const updatingFromSource = useRef(false)

  // Convert content to HTML for the editor
  const initialHtml = marked(content)

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
      if (updatingFromExternal.current || updatingFromSource.current) {
        updatingFromExternal.current = false
        updatingFromSource.current = false
        return
      }

      const html = editor.getHTML()
      const md = turndownService.turndown(html)
      onChange(md)
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
      filter: (node: HTMLElement) => {
        const tagName = node.tagName.toLowerCase()
        return ['s', 'strike', 'del'].includes(tagName)
      },
      replacement: content => `~~${content}~~`
    })
  }, [turndownService])

  // Update editor when content changes externally
  useEffect(() => {
    if (editor && content !== turndownService.turndown(editor.getHTML())) {
      updatingFromExternal.current = true
      const html = marked(content)
      editor.commands.setContent(html)
    }
  }, [content, editor, turndownService])

  // Handle source markdown changes
  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMarkdown = e.target.value
    onChange(newMarkdown)

    // Update the editor content
    if (editor) {
      updatingFromSource.current = true
      const html = marked(newMarkdown)
      editor.commands.setContent(html)
    }
  }

  // Toggle between source and WYSIWYG modes
  const toggleSourceMode = () => {
    setIsSourceMode(!isSourceMode)
  }

  return (
    <div className={`markdown-editor ${className}`}>
      <div className="editor-toolbar-container">
        <EditorToolbar
          editor={editor}
          disabled={isSourceMode}
          isSourceMode={isSourceMode}
          allowSourceView={allowSourceView}
          onToggleSourceMode={toggleSourceMode}
        />
      </div>
      <div className="editor-content-container">
        {isSourceMode && allowSourceView ? (
          <textarea
            className="markdown-source"
            value={content}
            onChange={handleSourceChange}
            placeholder={placeholder}
          />
        ) : (
          <div className="rich-editor-content-wrapper">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor
