import React, { useState, useEffect, useRef } from 'react'
import { Editor } from '@tiptap/react'
import { FiX } from 'react-icons/fi'
import './ColorPickerModal.css'

interface ColorPickerModalProps {
  editor: Editor
  onClose: () => void
  initialColor?: string
}

const PRESET_COLORS = [
  // First row - dark and neutral tones
  'black',
  'dimgray',
  'gray',
  'darkgray',
  'silver',
  'lightgray',
  'brown',
  'sienna',

  // Second row - warm and bright tones
  'darkred',
  'red',
  'orangered',
  'orange',
  'gold',
  'yellow',
  'darkkhaki',
  'green',

  // Third row - cool and bold tones
  'darkgreen',
  'teal',
  'navy',
  'blue',
  'indigo',
  'purple',
  'magenta',
  'hotpink'
]

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  editor,
  onClose,
  initialColor = 'black'
}) => {
  const [color, setColor] = useState(initialColor)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)
  const [selectedText, setSelectedText] = useState('')

  // Function to convert RGB to Hex
  const ensureHexColor = (inputColor: string): string => {
    // If it's one of our predefined colors, keep the name
    if (PRESET_COLORS.includes(inputColor.toLowerCase())) {
      return inputColor.toLowerCase()
    }

    if (inputColor.startsWith('#')) {
      return inputColor
    }

    // For named colors, create a temporary element to get the RGB value
    if (!inputColor.startsWith('rgb')) {
      const tempEl = document.createElement('div')
      tempEl.style.color = inputColor
      document.body.appendChild(tempEl)
      const rgbColor = window.getComputedStyle(tempEl).color
      document.body.removeChild(tempEl)
      inputColor = rgbColor
    }

    // Convert RGB to Hex
    if (inputColor.startsWith('rgb')) {
      const rgbMatch = inputColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0')
        const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0')
        const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0')
        return `#${r}${g}${b}`
      }
    }

    return inputColor
  }

  useEffect(() => {
    // Get the selected text
    const { from, to } = editor.state.selection
    let text = ''
    if (!editor.state.selection.empty) {
      text = editor.state.doc.textBetween(from, to, ' ')
    }
    setSelectedText(text)
  }, [editor])

  const handleApplyColor = () => {
    if (!selectedText.trim()) {
      onClose()
      return
    }

    // Apply the color to the selected text using the editor's API
    // Use the color name for predefined colors, hex for custom colors
    const finalColor = PRESET_COLORS.includes(color.toLowerCase())
      ? color.toLowerCase()
      : ensureHexColor(color)

    editor.chain().focus().setMark('textStyle', { color: finalColor }).run()

    onClose()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div className="color-picker-modal-backdrop" onMouseDown={handleMouseDown}>
      <div
        className="color-picker-modal"
        onClick={e => {
          // Prevent clicks inside the modal from closing it
          e.stopPropagation()
        }}
      >
        <div className="color-picker-header">
          <h3>Text Color</h3>
          <button onClick={onClose} className="close-button" aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="color-picker-content">
          <div className="color-preview">
            <span style={{ color }}>{selectedText || 'Sample Text'}</span>
          </div>

          <div className="color-presets">
            <div className="color-presets-label">Presets:</div>
            <div className="color-presets-grid">
              {PRESET_COLORS.map(presetColor => (
                <button
                  key={presetColor}
                  className={`color-preset ${presetColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => setColor(presetColor)}
                  aria-label={`Color ${presetColor}`}
                />
              ))}
            </div>
          </div>

          <div className="color-input-group">
            {/* Hidden color input for native picker */}
            <input
              type="color"
              value={color.startsWith('#') ? color : ensureHexColor(color)}
              onChange={e => {
                const hexColor = e.target.value
                setColor(hexColor)
              }}
              style={{
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none'
              }}
              ref={colorInputRef}
            />
            <label htmlFor="color-input">Custom:</label>
            <input
              id="color-input"
              type="text"
              value={color}
              onChange={e => setColor(e.target.value)}
              onBlur={e => setColor(ensureHexColor(e.target.value))}
              onClick={e => {
                // Stop propagation to prevent other handlers from interfering
                e.stopPropagation()
                // Focus the input
                if (textInputRef.current) {
                  textInputRef.current.focus()
                }
              }}
              className="color-text-input"
              placeholder="i.e: #ff0000 or red"
              autoComplete="off"
              spellCheck="false"
              ref={textInputRef}
            />
            <button
              className="pick-color-button"
              onClick={e => {
                e.preventDefault()
                // Use the hidden color input
                if (colorInputRef.current) {
                  colorInputRef.current.click()
                }
              }}
            >
              Pick Color
            </button>
            <div
              className="color-preview-square"
              style={{ backgroundColor: color }}
              onClick={() => {
                // Use the hidden color input
                if (colorInputRef.current) {
                  colorInputRef.current.click()
                }
              }}
            />
          </div>
        </div>

        <div className="color-picker-actions">
          <button onClick={onClose} className="cancel-button action-button">
            Cancel
          </button>
          <button
            onClick={handleApplyColor}
            className="apply-button action-button primary"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default ColorPickerModal
