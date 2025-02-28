import { useState, useEffect, useRef } from 'react'
import { Editor } from '@tiptap/react'
import { FiX } from 'react-icons/fi'
import './ButtonPickerModal.css'

interface ButtonPickerModalProps {
  editor: Editor
  onClose: () => void
  initialUrl?: string
  initialShape?: string
  initialColor?: string
  initialText?: string
  isEditMode?: boolean
  buttonPosition?: { from: number; to: number }
}

// Button style presets - separated into shape and color
const buttonShapes = [
  { id: 'pill', label: 'Pill' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'rect', label: 'Rectangle' }
]

const buttonColors = [
  { id: 'purple', label: 'Purple' },
  { id: 'blue', label: 'Blue' },
  { id: 'green', label: 'Green' },
  { id: 'red', label: 'Red' },
  { id: 'yellow', label: 'Yellow' },
  { id: 'gray', label: 'Gray' },
  { id: 'black', label: 'Black' },
  { id: 'white', label: 'White' }
]

const ButtonPickerModal = ({
  editor,
  onClose,
  initialUrl = '',
  initialShape = '',
  initialColor = '',
  initialText = '',
  isEditMode = false,
  buttonPosition
}: ButtonPickerModalProps) => {
  const [buttonText, setButtonText] = useState(initialText || '')
  const [url, setUrl] = useState(initialUrl || '')
  const [selectedShape, setSelectedShape] = useState(initialShape || 'pill')
  const [selectedColor, setSelectedColor] = useState(initialColor || 'blue')
  const [urlError, setUrlError] = useState('')
  const buttonTextInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Only get selected text if we're not in edit mode
    if (!isEditMode) {
      let text = ''
      const { from, to } = editor.state.selection
      if (from !== to) {
        text = editor.state.doc.textBetween(from, to, ' ')
      }
      setButtonText(text)
    }
  }, [editor, isEditMode])

  const handleApplyButton = () => {
    if (!isEditMode && !buttonText) {
      // If no text is entered and not in edit mode, focus on the text input
      if (buttonTextInputRef.current) {
        buttonTextInputRef.current.focus()
      }
      return
    }

    // Validate URL
    if (!url.trim()) {
      setUrlError('URL cannot be empty')
      if (urlInputRef.current) {
        urlInputRef.current.focus()
      }
      return
    }

    // Clear any previous errors
    setUrlError('')

    // Create the button directive
    const buttonDirective = `<a href="${url}" class="button-directive shape-${selectedShape} color-${selectedColor}">${buttonText}</a>`

    // Find the link node, extract its text, and replace it with plain text
    const { state } = editor
    const { from, to } = state.selection

    if (isEditMode && buttonPosition) {
      // Find all nodes between the selection
      state.doc.nodesBetween(from, to, (node, pos) => {
        if (
          node.type.name === 'text' &&
          node.marks.some(mark => mark.type.name === 'link')
        ) {
          // This is a link (text with link mark)
          // const buttonText = node.text || ''
          const markFrom = pos
          const markTo = pos + node.nodeSize

          // In edit mode, delete the existing button and insert the new one at the exact position
          editor
            .chain()
            .focus()
            .deleteRange({ from: markFrom, to: markTo })
            .insertContent(buttonDirective)
            .run()
        }
      })
    } else {
      // In add mode, insert the button directive at the current selection
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(buttonDirective)
        .run()
    }

    onClose()
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    // Clear error when user starts typing
    if (e.target.value.trim() && urlError) {
      setUrlError('')
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="color-picker-modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="color-picker-modal button-picker-modal"
        onClick={e => {
          // Prevent clicks inside the modal from closing it
          e.stopPropagation()
        }}
      >
        <div className="color-picker-header">
          <h3>{isEditMode ? 'Edit Button' : 'Add Button'}</h3>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="color-picker-content">
          <div className="form-group">
            <label htmlFor="buttonText">Button Text</label>
            <input
              type="text"
              id="buttonText"
              value={buttonText}
              onChange={e => setButtonText(e.target.value)}
              placeholder="Enter button text"
              className="color-text-input"
              ref={buttonTextInputRef}
            />
          </div>

          <div className="form-group">
            <label htmlFor="buttonUrl">URL</label>
            <input
              type="text"
              id="buttonUrl"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              className="color-text-input"
              ref={urlInputRef}
            />
            {urlError && <div className="error-message">{urlError}</div>}
          </div>

          <div className="form-group">
            <div className="color-presets-label">Button Shape</div>
            <div className="button-shape-grid">
              {buttonShapes.map(shape => (
                <div
                  key={shape.id}
                  className={`button-shape-option ${shape.id} ${
                    selectedShape === shape.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedShape(shape.id)}
                >
                  {shape.label}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div className="color-presets-label">Button Color</div>
            <div className="button-color-grid">
              {buttonColors.map(color => (
                <div
                  key={color.id}
                  className={`button-color-option ${color.id} ${
                    selectedColor === color.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedColor(color.id)}
                >
                  {color.label}
                </div>
              ))}
            </div>
          </div>

          <div className="button-preview-section">
            <div className="color-presets-label">Preview</div>
            <div className="button-preview-container">
              <button
                className={`button-preview ${selectedShape}-${selectedColor}`}
              >
                {isEditMode
                  ? buttonText || 'Button Text'
                  : buttonText || 'Button Text'}
              </button>
            </div>
          </div>
        </div>

        <div className="color-picker-actions">
          <button className="cancel-button action-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="apply-button action-button primary"
            onClick={handleApplyButton}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default ButtonPickerModal
