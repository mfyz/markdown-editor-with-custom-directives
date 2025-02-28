import { Editor } from '@tiptap/react'
import { FiEdit2, FiExternalLink, FiTrash2 } from 'react-icons/fi'
import { MdSmartButton } from 'react-icons/md'
import './ButtonPopover.css'

interface ButtonPopoverProps {
  editor: Editor
  data: {
    url: string
    shape: string
    color: string
  }
  onEdit: () => void
  onClose: () => void
}

const ButtonPopover = ({
  editor,
  data,
  onEdit,
  onClose
}: ButtonPopoverProps) => {
  const { url } = data

  const handleDelete = () => {
    // Find the button node and delete it
    const { state } = editor
    const { from, to } = state.selection
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === 'buttonDirective') {
        editor
          .chain()
          .focus()
          .deleteRange({ from: pos, to: pos + node.nodeSize })
          .run()
        onClose()
        return false
      }
    })
  }

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault()
    if (url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="button-popover-container">
      <div className="button-popover-content">
        {url !== '#' && (
          <a
            href={url}
            className="button-url-wrapper"
            onClick={handleOpen}
            title={url}
          >
            <MdSmartButton />
            <span className="button-url">{url}</span>
            <FiExternalLink className="open-icon" />
          </a>
        )}
        <div className="button-actions">
          <button
            onClick={onEdit}
            className="action-button"
            title="Edit button"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={handleDelete}
            className="action-button"
            title="Remove button"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ButtonPopover
