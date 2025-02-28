import { useState, useEffect, useRef } from 'react'
import { Editor } from '@tiptap/react'
import { FiX } from 'react-icons/fi'
import './ButtonPickerModal.css'

interface ButtonPickerModalProps {
  editor: Editor
  onClose: () => void
  initialUrl?: string
  initialStyle?: string
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
  initialStyle = 'pill-blue'
}: ButtonPickerModalProps) => {
  const [buttonText, setButtonText] = useState('')
  const [url, setUrl] = useState(initialUrl)

  // Split the initial style into shape and color
  const initialStyleParts = initialStyle.split('-')
  const [selectedShape, setSelectedShape] = useState(
    initialStyleParts[0] || 'pill'
  )
  const [selectedColor, setSelectedColor] = useState(
    initialStyleParts[1] || 'blue'
  )

  // Refs for input fields
  const buttonTextInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Get the selected text from the editor
    let text = ''
    if (editor && editor.state.selection) {
      const { from, to } = editor.state.selection
      text = editor.state.doc.textBetween(from, to, ' ')
    }
    setButtonText(text)

    // Focus on the text input if no text is selected, otherwise focus on URL
    setTimeout(() => {
      if (!text && buttonTextInputRef.current) {
        buttonTextInputRef.current.focus()
      } else if (urlInputRef.current) {
        urlInputRef.current.focus()
      }
    }, 100)
  }, [editor])

  const handleApplyButton = () => {
    if (!buttonText.trim()) {
      alert('Please enter button text')
      return
    }

    if (!url.trim()) {
      alert('Please enter a URL')
      return
    }

    // Create the button directive with attribute-based syntax
    const buttonDirective = `:button[${buttonText}]{url=${url} shape=${selectedShape} color=${selectedColor}}`

    // Insert the button directive at the current selection
    const { from, to } = editor.state.selection
    editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(buttonDirective)
      .run()

    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop
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
          <h3>Button Settings</h3>
          <button onClick={onClose} className="close-button" aria-label="Close">
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
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="color-text-input"
              ref={urlInputRef}
            />
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
                  <span>{shape.label}</span>
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
                  <span className="color-label">{color.label}</span>
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
                {buttonText || 'Button Text'}
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
