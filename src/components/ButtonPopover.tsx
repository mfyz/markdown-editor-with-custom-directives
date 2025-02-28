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
    text: string
    from: number
    to: number
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
        const buttonText = node.text || ''
        const markFrom = pos
        const markTo = pos + node.nodeSize

        // Replace the link with plain text
        editor
          .chain()
          .focus()
          .deleteRange({ from: markFrom, to: markTo })
          .insertContent(buttonText)
          .run()

        return false
      }
    })

    onClose()
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
