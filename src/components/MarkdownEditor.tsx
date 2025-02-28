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
import LinkModal from './LinkModal'
import LinkPopover from './LinkPopover'

interface MarkdownEditorProps {
  content: string
  onChange: (markdown: string) => void
  placeholder?: string
  className?: string
  allowSourceView?: boolean
  singleLineMode?: boolean
}

const MarkdownEditor = ({
  content,
  onChange,
  placeholder = 'Write something...',
  className = '',
  allowSourceView = true,
  singleLineMode = false
}: MarkdownEditorProps) => {
  const [isSourceMode, setIsSourceMode] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showLinkPopover, setShowLinkPopover] = useState(false)
  const [linkPopoverPosition, setLinkPopoverPosition] = useState({
    top: 0,
    left: 0
  })
  const [currentLinkUrl, setCurrentLinkUrl] = useState('')
  const popoverRef = useRef<HTMLDivElement>(null)
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
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        validate: href => /^https?:\/\//.test(href)
      }),
      TextStyle,
      Color,
      Strike
    ],
    content: initialHtml,
    editable: true,
    editorProps: {
      attributes: {
        class: 'markdown-editor-content',
        placeholder
      },
      handleKeyDown: singleLineMode
        ? (_view, event) => {
            // Prevent Enter key in single-line mode
            if (event.key === 'Enter') {
              return true // Returning true prevents the default behavior
            }
            return false
          }
        : undefined
    },
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
    onSelectionUpdate: ({ editor }) => {
      // Check if selection is within a link
      const linkAttrs = editor.getAttributes('link')
      if (linkAttrs.href) {
        setCurrentLinkUrl(linkAttrs.href)
        const { from } = editor.state.selection
        const pos = editor.view.coordsAtPos(from)
        const { to } = editor.state.selection
        const endPos = editor.view.coordsAtPos(to)

        // Calculate the center position and adjust height to be above the text
        const centerX = pos.left + (endPos.left - pos.left) / 2
        const topPosition = pos.top - 48 // Move up by the height of the popover plus some padding

        setLinkPopoverPosition({
          top: topPosition,
          left: centerX
        })
        setShowLinkPopover(true)
      } else {
        setShowLinkPopover(false)
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

    // Add rules for links
    turndownService.addRule('link', {
      filter: node => {
        return (
          node.nodeName.toLowerCase() === 'a' &&
          (node as HTMLElement).getAttribute('href') !== null
        )
      },
      replacement: (content, node) => {
        const element = node as HTMLElement
        const href = element.getAttribute('href')
        const title = element.title ? ` "${element.title}"` : ''
        return href ? `[${content}](${href}${title})` : content
      }
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

  // Handle click outside popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowLinkPopover(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`markdown-editor ${className}`}>
      <div className="editor-toolbar-container">
        <EditorToolbar
          editor={editor}
          disabled={isSourceMode}
          isSourceMode={isSourceMode}
          allowSourceView={allowSourceView && !singleLineMode}
          onToggleSourceMode={toggleSourceMode}
          onShowLinkModal={() => setShowLinkModal(true)}
        />
      </div>
      <div className="editor-content-container">
        {/* Hide source mode in single-line mode */}
        {isSourceMode && allowSourceView && !singleLineMode ? (
          <textarea
            className="markdown-source"
            value={content}
            onChange={handleSourceChange}
            placeholder={placeholder}
          />
        ) : (
          <div
            className={`rich-editor-content-wrapper ${singleLineMode ? 'single-line-mode' : ''}`}
          >
            <EditorContent editor={editor} />
            {showLinkPopover && editor && (
              <div
                ref={popoverRef}
                style={{
                  position: 'fixed',
                  top: linkPopoverPosition.top,
                  left: linkPopoverPosition.left
                }}
              >
                <LinkPopover
                  editor={editor}
                  url={currentLinkUrl}
                  onEdit={() => {
                    setShowLinkModal(true)
                    setShowLinkPopover(false)
                  }}
                  onClose={() => setShowLinkPopover(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {showLinkModal && editor && (
        <LinkModal editor={editor} onClose={() => setShowLinkModal(false)} />
      )}
    </div>
  )
}

export default MarkdownEditor
