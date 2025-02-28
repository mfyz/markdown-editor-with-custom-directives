import { Editor } from '@tiptap/react'
import './EditorToolbar.css'
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiCode,
  FiEye,
  FiLink
} from 'react-icons/fi'
import {
  RiH1,
  RiH2,
  RiH3,
  RiListOrdered,
  RiStrikethrough,
  RiDoubleQuotesL
} from 'react-icons/ri'
import { useState, useCallback } from 'react'
import LinkModal from './LinkModal'

interface EditorToolbarProps {
  editor: Editor | null
  disabled?: boolean
  isSourceMode?: boolean
  allowSourceView?: boolean
  onToggleSourceMode?: () => void
  onShowLinkModal?: () => void
}

const EditorToolbar = ({
  editor,
  disabled = false,
  isSourceMode = false,
  allowSourceView = true,
  onToggleSourceMode = () => {},
  onShowLinkModal = () => {}
}: EditorToolbarProps) => {
  const [showLinkModal, setShowLinkModal] = useState(false)

  if (!editor) {
    return null
  }

  const hasTextSelection = useCallback(() => {
    if (!editor) return false
    const { from, to } = editor.state.selection
    return from !== to
  }, [editor])

  const isLinkActive = editor.isActive('link')
  const canAddLink = hasTextSelection() || isLinkActive

  return (
    <div className={`editor-toolbar ${disabled ? 'disabled' : ''}`}>
      <div className="toolbar-buttons-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold (⌘B)"
          disabled={disabled}
        >
          <FiBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic (⌘I)"
          disabled={disabled}
        >
          <FiItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          title="Underline (⌘U)"
          disabled={disabled}
        >
          <FiUnderline />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strikethrough"
          disabled={disabled}
        >
          <RiStrikethrough />
        </button>
        <div className="divider" />
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
          }
          title="Heading 1"
          disabled={disabled}
        >
          <RiH1 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
          }
          title="Heading 2"
          disabled={disabled}
        >
          <RiH2 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
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
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
          disabled={disabled}
        >
          <FiList />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Numbered List"
          disabled={disabled}
        >
          <RiListOrdered />
        </button>
        <div className="divider" />
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          title="Code Block"
          disabled={disabled}
        >
          <FiCode />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          title="Quote"
          disabled={disabled}
        >
          <RiDoubleQuotesL />
        </button>
        <div className="divider" />
        <button
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
      </div>

      {allowSourceView && (
        <div className="toolbar-buttons-group right">
          <button
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
        <LinkModal editor={editor} onClose={() => setShowLinkModal(false)} />
      )}
    </div>
  )
}

export default EditorToolbar
