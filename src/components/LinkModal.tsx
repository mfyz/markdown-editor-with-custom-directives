import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { FiX, FiTrash2 } from 'react-icons/fi'
import './LinkModal.css'

interface LinkModalProps {
  editor: Editor
  onClose: () => void
}

const LinkModal = ({ editor, onClose }: LinkModalProps) => {
  const [url, setUrl] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const attrs = editor.getAttributes('link')
    if (attrs.href) {
      setUrl(attrs.href)
      setIsEditing(true)
    }
  }, [editor])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      onClose()
      return
    }

    // Ensure URL has https:// prefix
    const normalizedUrl =
      url.startsWith('https://') || url.startsWith('http://')
        ? url
        : `https://${url}`

    // console.log('normalizedUrl:', normalizedUrl)

    editor.chain().focus().setLink({ href: normalizedUrl }).run()
    onClose()
  }

  const handleRemove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    onClose()
  }

  return (
    <div className="link-modal-backdrop">
      <div className="link-modal">
        <form onSubmit={handleSubmit}>
          <div className="link-modal-header">
            <span>{isEditing ? 'Edit Link' : 'Add Link'}</span>
            <button
              type="button"
              className="close-button"
              onClick={onClose}
              title="Close"
            >
              <FiX />
            </button>
          </div>
          <div className="link-modal-content">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="link-url-input"
              autoFocus
            />
            <div className="link-modal-actions">
              {isEditing && (
                <button
                  type="button"
                  className="action-button remove"
                  onClick={handleRemove}
                  title="Remove link"
                >
                  <FiTrash2 />
                </button>
              )}
              <button type="submit" className="action-button primary">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LinkModal
