import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Strike from '@tiptap/extension-strike'
import { useState, useEffect, useRef } from 'react'
import TurndownService from 'turndown'
import { marked } from 'marked'
import type { Renderer } from 'marked'
import './MarkdownEditor.css'
import EditorToolbar from './EditorToolbar'
import LinkModal from './LinkModal'
import LinkPopover from './LinkPopover'
import ButtonPopover from './ButtonPopover'
import ColorPickerModal from './ColorPickerModal'
import ButtonPickerModal from './ButtonPickerModal'
import { TextColorExtension } from '../extensions/TextColorExtension'
import { ButtonDirectiveExtension } from '../extensions/ButtonDirectiveExtension'
import '../extensions/TextColorExtension.css'
import '../extensions/ButtonDirectiveExtension.css'

// Helper function to parse attributes from a string
function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {}

  // Match key=value pairs, handling spaces properly
  const attrRegex = /(\w+)=([^\s]+|"[^"]*")/g
  let match

  while ((match = attrRegex.exec(attrString)) !== null) {
    const key = match[1]
    let value = match[2]

    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1)
    }

    attrs[key] = value
  }

  return attrs
}

// Add custom renderer for color and button directives
const renderer: Partial<Renderer> = {
  text(token) {
    // Replace color directives with styled spans
    let processedText = token.text.replace(
      /:color\[(.*?)\]\{(#[0-9a-fA-F]{3,8}|[a-zA-Z]+)\}/g,
      (_, content, color) =>
        `<span style="color: ${color}" data-type="color-directive">${content}</span>`
    )

    // Keep button directives as-is for the extension to handle
    return processedText
  }
}

marked.use({ renderer })

// Add custom handler for button-directive elements
marked.use({
  extensions: [
    {
      name: 'button-directive',
      level: 'inline',
      start(src) {
        return src.match(/:button\[/)?.index
      },
      tokenizer(src) {
        const rule = /^:button\[(.*?)\]\{(.*?)\}/
        const match = rule.exec(src)
        if (match) {
          return {
            type: 'button-directive',
            raw: match[0],
            text: match[1],
            attrs: match[2]
          }
        }
      },
      renderer(token) {
        const attrs = parseAttributes(token.attrs)
        const url = attrs.url || '#'
        const shape = attrs.shape || 'pill'
        const color = attrs.color || 'blue'

        return `<a class="button-directive shape-${shape} color-${color}" href="${url}" data-type="button-directive">${token.text}</a>`
      }
    }
  ]
})

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
  const [showColorPickerModal, setShowColorPickerModal] = useState(false)
  const [showButtonPickerModal, setShowButtonPickerModal] = useState(false)
  const [linkPopoverPosition, setLinkPopoverPosition] = useState({
    top: 0,
    left: 0
  })
  const [currentLinkUrl, setCurrentLinkUrl] = useState('')
  const [buttonPopoverPosition, setButtonPopoverPosition] = useState({
    top: 0,
    left: 0
  })
  const [currentButtonData, setCurrentButtonData] = useState({
    url: '',
    shape: '',
    color: ''
  })
  const [showButtonPopover, setShowButtonPopover] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [isEditorActive, setIsEditorActive] = useState(false)
  const [turndownService] = useState(() => {
    const service = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '*'
    })

    // Add rule for button directives
    service.addRule('buttonDirective', {
      filter: node => {
        return (
          node.nodeName === 'A' && node.classList.contains('button-directive')
        )
      },
      replacement: (content, node) => {
        if (!(node instanceof HTMLElement)) return content

        const shape = node.getAttribute('data-shape') || 'pill'
        const color = node.getAttribute('data-color') || 'blue'
        const url = node.getAttribute('href') || '#'

        return `:button[${content}]{url=${url} shape=${shape} color=${color}}`
      }
    })

    // Override the escape function to preserve brackets and braces
    service.escape = string => {
      return (
        string
          .replace(/\*/g, '\\*')
          .replace(/^-/g, '\\-')
          .replace(/^\+ /g, '\\+ ')
          .replace(/^(=+)/g, '\\$1')
          .replace(/^(#{1,6}) /g, '\\$1 ')
          .replace(/`/g, '\\`')
          .replace(/^~~~/g, '\\~~~')
          // Remove bracket and brace escaping
          // .replace(/\[/g, '\\[')
          // .replace(/\]/g, '\\]')
          .replace(/^>/g, '\\>')
          .replace(/_/g, '\\_')
          .replace(/^(\d+)\. /g, '$1\\. ')
      )
    }

    return service
  })

  // Reference to track if the update is coming from external source
  const updatingFromExternal = useRef(false)
  // Reference to track if the update is coming from source editor
  const updatingFromSource = useRef(false)

  // Convert content to HTML for the editor
  const initialHtml = marked(content)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      }),
      TextStyle,
      Color,
      Strike,
      TextColorExtension.configure({
        preserveInSingleLine: true
      }),
      ButtonDirectiveExtension.configure({
        // Add any configuration options here if needed
      })
    ],
    content: initialHtml,
    editable: true,
    autofocus: false,
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
        : undefined,
      handleDOMEvents: {
        focus: () => {
          setIsEditorActive(true)
          return false
        },
        blur: () => {
          setIsEditorActive(false)
          return false
        }
      }
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
    onTransaction: ({ editor, transaction }) => {
      // Check if this transaction involves setting marks (like colors)
      if (transaction.steps.some(step => step.hasOwnProperty('mark'))) {
        const html = editor.getHTML()
        const md = turndownService.turndown(html)
        onChange(md)
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const { from } = editor.state.selection

      // Check if selection is within a regular link
      const linkAttrs = editor.getAttributes('link')
      const isButton = Boolean(linkAttrs?.class?.includes('button-directive'))
      if (linkAttrs.href && from !== 1000) {
        const pos = editor.view.coordsAtPos(from)
        setCurrentLinkUrl(linkAttrs.href)
        if (isButton) {
          // Get shape and color from DOM element classes
          const dom = editor.view.dom
          const selection = window.getSelection()
          if (selection && selection.anchorNode) {
            let currentNode = selection.anchorNode as HTMLElement
            while (currentNode && currentNode !== dom) {
              if (currentNode.nodeType === Node.ELEMENT_NODE) {
                const element = currentNode as HTMLElement
                if (element.classList.contains('button-directive')) {
                  const classList = Array.from(element.classList)
                  const shapeClass = classList.find(cls =>
                    cls.startsWith('shape-')
                  )
                  const colorClass = classList.find(cls =>
                    cls.startsWith('color-')
                  )

                  const shape = shapeClass ? shapeClass.split('-')[1] : 'pill'
                  const color = colorClass ? colorClass.split('-')[1] : 'blue'

                  setCurrentButtonData({
                    url: element.getAttribute('href') || '#',
                    shape,
                    color
                  })
                  break
                }
              }
              currentNode = currentNode.parentNode as HTMLElement
            }
          }

          setButtonPopoverPosition({
            top: pos.top - 60, // Increased offset to position higher above content
            left: pos.left
          })
          setShowButtonPopover(true)
          setShowLinkPopover(false)
        } else {
          setLinkPopoverPosition({
            top: pos.top - 50,
            left: pos.left
          })
          setShowLinkPopover(true)
          setShowButtonPopover(false)
        }
      } else {
        setShowLinkPopover(false)
        setShowButtonPopover(false)
      }
    }
  })

  // Configure turndown service
  useEffect(() => {
    // Add rules for strikethrough if needed
    turndownService.addRule('strikethrough', {
      filter: (node: HTMLElement): boolean => {
        return (
          node.nodeName.toLowerCase() === 's' ||
          node.nodeName.toLowerCase() === 'strike' ||
          (node.nodeName.toLowerCase() === 'span' &&
            node.style.textDecoration === 'line-through')
        )
      },
      replacement: content => `~~${content}~~`
    })

    // Add rules for text color
    turndownService.addRule('textColor', {
      filter: (node: HTMLElement): boolean => {
        return (
          node.nodeName.toLowerCase() === 'span' &&
          Boolean(
            node.style.color || node.getAttribute('style')?.includes('color:')
          )
        )
      },
      replacement: (content, node) => {
        const element = node as HTMLElement
        let hexColor = element.style.color || ''

        // Convert named colors or rgb to hex if needed
        if (hexColor && !hexColor.startsWith('#')) {
          // For simplicity, we'll just handle basic named colors
          if (hexColor === 'red') {
            hexColor = '#ff0000'
          } else if (hexColor === 'green') {
            hexColor = '#008000'
          } else if (hexColor === 'blue') {
            hexColor = '#0000ff'
          } else if (hexColor.startsWith('rgb')) {
            // Convert rgb to hex
            const rgb = hexColor.match(/\d+/g)
            if (rgb && rgb.length >= 3) {
              const r = parseInt(rgb[0]).toString(16).padStart(2, '0')
              const g = parseInt(rgb[1]).toString(16).padStart(2, '0')
              const b = parseInt(rgb[2]).toString(16).padStart(2, '0')
              hexColor = `#${r}${g}${b}`
            }
          }
        }
        // Use String.raw to prevent escaping of special characters
        return String.raw`:color[${content}]{${hexColor}}`
      }
    })

    // Add rules for button directives
    turndownService.addRule('buttonDirective', {
      filter: (node: HTMLElement): boolean => {
        return (
          node.nodeName.toLowerCase() === 'a' &&
          node.classList.contains('button-directive')
        )
      },
      replacement: (content, node) => {
        const element = node as HTMLElement
        const url = element.getAttribute('href') || ''
        const shape = element.getAttribute('data-shape') || 'pill'
        const color = element.getAttribute('data-color') || 'blue'

        return String.raw`:button[${content}]{url=${url} shape=${shape} color=${color}}`
      }
    })

    // Add rules for links
    turndownService.addRule('link', {
      filter: node => {
        return (
          node.nodeName.toLowerCase() === 'a' &&
          (node as HTMLElement).getAttribute('href') !== null &&
          !(node as HTMLElement).classList.contains('button-directive')
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
      marked.use({ renderer })
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
    // Weird last-link/button showing popover bug fix
    setTimeout(() => {
      setShowLinkPopover(false)
      setShowButtonPopover(false)
    }, 10)

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowLinkPopover(false)
        setShowButtonPopover(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Handle button selection event
    const handleButtonSelected = (e: CustomEvent) => {
      const { pos, attrs } = e.detail
      const { url, shape, color } = attrs

      // Get coordinates at position
      const coordinates = editor?.view.coordsAtPos(pos)
      if (!coordinates) return

      setButtonPopoverPosition({
        top: coordinates.top - 60, // Increased offset to position higher above content
        left: coordinates.left
      })

      setCurrentButtonData({
        url,
        shape,
        color
      })

      setShowButtonPopover(true)
      setShowLinkPopover(false)
    }

    window.addEventListener(
      'button-selected',
      handleButtonSelected as EventListener
    )

    return () => {
      window.removeEventListener(
        'button-selected',
        handleButtonSelected as EventListener
      )
    }
  }, [editor])

  return (
    <div className={`markdown-editor ${className}`}>
      {/* Show toolbar always for regular mode, or only when focused for single-line mode */}
      {(!singleLineMode || (singleLineMode && isEditorActive)) && (
        <div className="editor-toolbar-container">
          <EditorToolbar
            editor={editor}
            disabled={isSourceMode}
            isSourceMode={isSourceMode}
            allowSourceView={allowSourceView && !singleLineMode}
            onToggleSourceMode={toggleSourceMode}
            onShowLinkModal={() => setShowLinkModal(true)}
            onShowColorPickerModal={() => setShowColorPickerModal(true)}
            onShowButtonPickerModal={() => setShowButtonPickerModal(true)}
            singleLineMode={singleLineMode}
          />
        </div>
      )}
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
            style={{ position: singleLineMode ? 'relative' : 'static' }}
          >
            <EditorContent editor={editor} />
            {showLinkPopover && editor && (
              <div
                ref={popoverRef}
                className="link-popover"
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
            {showButtonPopover && editor && (
              <div
                ref={popoverRef}
                className="button-popover"
                style={{
                  position: 'fixed',
                  top: buttonPopoverPosition.top,
                  left: buttonPopoverPosition.left
                }}
              >
                <ButtonPopover
                  editor={editor}
                  data={currentButtonData}
                  onEdit={() => {
                    setShowButtonPickerModal(true)
                    setShowButtonPopover(false)
                  }}
                  onClose={() => setShowButtonPopover(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {showLinkModal && editor && (
        <LinkModal editor={editor} onClose={() => setShowLinkModal(false)} />
      )}
      {showColorPickerModal && editor && (
        <ColorPickerModal
          editor={editor}
          onClose={() => setShowColorPickerModal(false)}
          initialColor={editor.getAttributes('textStyle').color || 'black'}
        />
      )}
      {showButtonPickerModal && editor && (
        <ButtonPickerModal
          editor={editor}
          onClose={() => setShowButtonPickerModal(false)}
        />
      )}
    </div>
  )
}

export default MarkdownEditor
