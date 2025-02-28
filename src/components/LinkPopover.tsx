import { Editor } from '@tiptap/react'
import { FiEdit2, FiExternalLink, FiTrash2 } from 'react-icons/fi'
import './LinkPopover.css'

interface LinkPopoverProps {
  editor: Editor
  url: string
  onEdit: () => void
  onClose: () => void
}

const LinkPopover = ({ editor, url, onEdit, onClose }: LinkPopoverProps) => {
  const handleDelete = () => {
    // Find the link node, extract its text, and replace it with plain text
    const { state } = editor
    const { from, to } = state.selection

    // Find all nodes between the selection
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (
        node.type.name === 'text' &&
        node.marks.some(mark => mark.type.name === 'link')
      ) {
        // This is a link (text with link mark)
        const linkText = node.text || ''
        const markFrom = pos
        const markTo = pos + node.nodeSize

        // Replace the link with plain text
        editor
          .chain()
          .focus()
          .deleteRange({ from: markFrom, to: markTo })
          .insertContent(linkText)
          .run()

        return false
      }
    })

    onClose()
  }

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="link-popover-container">
      <div className="link-popover-content">
        <a
          href={url}
          className="link-url-wrapper"
          onClick={handleOpen}
          title={url}
        >
          <span className="link-url">{url}</span>
          <FiExternalLink className="open-icon" />
        </a>
        <div className="link-actions">
          <button onClick={onEdit} className="action-button" title="Edit link">
            <FiEdit2 />
          </button>
          <button
            onClick={handleDelete}
            className="action-button"
            title="Remove link"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LinkPopover
