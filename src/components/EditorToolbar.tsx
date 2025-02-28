import { Editor as TiptapEditor } from '@tiptap/react'
import './EditorToolbar.css'
import { FiBold, FiItalic, FiList, FiCode, FiEye, FiLink } from 'react-icons/fi'
import {
  RiH1,
  RiH2,
  RiH3,
  RiListOrdered,
  RiStrikethrough,
  RiDoubleQuotesL
} from 'react-icons/ri'
import { MdFormatColorText } from 'react-icons/md'
import { useState, useCallback } from 'react'
import LinkModal from './LinkModal'

// Use the original Editor type
type Editor = TiptapEditor

interface EditorToolbarProps {
  editor: Editor | null
  disabled?: boolean
  isSourceMode?: boolean
  allowSourceView?: boolean
  onToggleSourceMode?: () => void
  onShowLinkModal?: () => void
  onShowColorPickerModal?: () => void
  singleLineMode?: boolean
}

const EditorToolbar = ({
  editor,
  disabled = false,
  isSourceMode = false,
  allowSourceView = true,
  onToggleSourceMode = () => {},
  onShowLinkModal = () => {},
  onShowColorPickerModal = () => {},
  singleLineMode = false
}: EditorToolbarProps) => {
  const [showLinkModal, setShowLinkModal] = useState(false)

  const handleLinkModalClose = useCallback(() => {
    setShowLinkModal(false)
  }, [])

  const handleLinkSubmit = useCallback(
    (url: string) => {
      if (editor) {
        // @ts-ignore - These methods exist in the actual implementation
        editor.chain().focus().setLink({ href: url }).run()
      }
      setShowLinkModal(false)
    },
    [editor]
  )

  // Function to check if there is a text selection
  const hasTextSelection = useCallback(() => {
    if (!editor) return false
    const { from, to } = editor.state.selection
    return from !== to
  }, [editor])

  // Check if the current selection is a link
  const isLinkActive = editor?.isActive('link') ?? false
  const canAddLink = hasTextSelection() || isLinkActive
  const canAddColor = hasTextSelection()

  // Prevent losing focus when clicking toolbar buttons
  const handleButtonMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])

  if (!editor) {
    return null
  }

  return (
    <div
      className={`editor-toolbar ${disabled ? 'disabled' : ''} ${singleLineMode ? 'single-line-toolbar' : ''}`}
    >
      <div className="toolbar-buttons-group">
        <button
          onMouseDown={handleButtonMouseDown}
          onClick={() => {
            // @ts-ignore - These methods exist in the actual implementation
            editor.chain().focus().toggleBold().run()
          }}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold (⌘B)"
          disabled={disabled}
        >
          <FiBold />
        </button>
        <button
          onMouseDown={handleButtonMouseDown}
          onClick={() => {
            // @ts-ignore - These methods exist in the actual implementation
            editor.chain().focus().toggleItalic().run()
          }}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic (⌘I)"
          disabled={disabled}
        >
          <FiItalic />
        </button>
        <button
          onMouseDown={handleButtonMouseDown}
          onClick={() => {
            // @ts-ignore - These methods exist in the actual implementation
            editor.chain().focus().toggleStrike().run()
          }}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strikethrough"
          disabled={disabled}
        >
          <RiStrikethrough />
        </button>
        <div className="divider" />
        {!singleLineMode && (
          <>
            <button
              onMouseDown={handleButtonMouseDown}
              onClick={() => {
                // @ts-ignore - These methods exist in the actual implementation
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }}
              className={
                editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
              }
              title="Heading 1"
              disabled={disabled}
            >
              <RiH1 />
            </button>
            <button
              onMouseDown={handleButtonMouseDown}
              onClick={() => {
                // @ts-ignore - These methods exist in the actual implementation
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }}
              className={
                editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
              }
              title="Heading 2"
              disabled={disabled}
            >
              <RiH2 />
            </button>
            <button
              onMouseDown={handleButtonMouseDown}
              onClick={() => {
                // @ts-ignore - These methods exist in the actual implementation
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }}
              className={
                editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
              }
              title="Heading 3"
              disabled={disabled}
            >
              <RiH3 />
            </button>
            <div className="divider" />
            <button
              onMouseDown={handleButtonMouseDown}
              onClick={() => {
                // @ts-ignore - These methods exist in the actual implementation
                editor.chain().focus().toggleBulletList().run()
              }}
              className={editor.isActive('bulletList') ? 'is-active' : ''}
              title="Bullet List"
              disabled={disabled}
            >
              <FiList />
            </button>
            <button
              onMouseDown={handleButtonMouseDown}
              onClick={() => {
                // @ts-ignore - These methods exist in the actual implementation
                editor.chain().focus().toggleOrderedList().run()
              }}
              className={editor.isActive('orderedList') ? 'is-active' : ''}
              title="Numbered List"
              disabled={disabled}
            >
              <RiListOrdered />
            </button>
            <div className="divider" />
            <button
              onMouseDown={handleButtonMouseDown}
              onClick={() => {
                // @ts-ignore - These methods exist in the actual implementation
                editor.chain().focus().toggleCodeBlock().run()
              }}
              className={editor.isActive('codeBlock') ? 'is-active' : ''}
              title="Code Block"
              disabled={disabled}
            >
              <FiCode />
            </button>
            <button
              onMouseDown={handleButtonMouseDown}
              onClick={() => {
                // @ts-ignore - These methods exist in the actual implementation
                editor.chain().focus().toggleBlockquote().run()
              }}
              className={editor.isActive('blockquote') ? 'is-active' : ''}
              title="Quote"
              disabled={disabled}
            >
              <RiDoubleQuotesL />
            </button>
            <div className="divider" />
          </>
        )}
        <button
          onMouseDown={handleButtonMouseDown}
          onClick={onShowLinkModal}
          className={isLinkActive ? 'is-active' : ''}
          title={
            canAddLink
              ? isLinkActive
                ? 'Edit Link'
                : 'Add Link'
              : 'Add link: Select text first'
          }
          disabled={disabled || !canAddLink}
        >
          <FiLink />
        </button>

        <button
          onMouseDown={handleButtonMouseDown}
          onClick={onShowColorPickerModal}
          title={canAddColor ? 'Text Color' : 'Text Color: Select text first'}
          disabled={disabled || !canAddColor}
        >
          <MdFormatColorText />
        </button>
      </div>

      {allowSourceView && (
        <div className="toolbar-buttons-group right">
          <button
            onMouseDown={handleButtonMouseDown}
            onClick={onToggleSourceMode}
            className={`source-toggle ${isSourceMode ? 'is-active' : ''}`}
            title={
              isSourceMode
                ? 'Switch to Visual Editor mode'
                : 'Switch to Markdown mode'
            }
          >
            <FiEye />
          </button>
        </div>
      )}

      {showLinkModal && (
        <LinkModal
          editor={editor}
          onClose={handleLinkModalClose}
          onSubmit={handleLinkSubmit}
        />
      )}
    </div>
  )
}

export default EditorToolbar
