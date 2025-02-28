/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react'
// Import types but don't use the actual implementation
import type { Editor } from '@tiptap/react'
import ColorPickerModal from './ColorPickerModal'

// Define a type that matches the shape of our mock
type MockEditor = {
  chain: jest.Mock
  focus: jest.Mock
  setMark: jest.Mock
  run: jest.Mock
  getAttributes: jest.Mock
  state: {
    doc: {
      textBetween: jest.Mock
    }
    selection: {
      from: number
      to: number
    }
  }
}

describe('ColorPickerModal', () => {
  // Create a mock editor with just the properties we need
  const mockEditor: MockEditor = {
    chain: jest.fn(() => mockEditor as any),
    focus: jest.fn(() => mockEditor as any),
    setMark: jest.fn(() => mockEditor as any),
    run: jest.fn(),
    state: {
      doc: {
        textBetween: jest.fn(() => 'Selected Text')
      },
      selection: {
        from: 0,
        to: 12
      }
    },
    getAttributes: jest.fn(() => ({}))
  }
  const mockOnClose: jest.Mock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with selected text', () => {
    render(
      <ColorPickerModal
        editor={mockEditor as unknown as Editor}
        onClose={mockOnClose}
        initialColor="#ff0000"
      />
    )

    // Check if the modal title is rendered
    expect(screen.getByText('Text Color')).toBeInTheDocument()

    // Check if the selected text is displayed in the preview
    expect(screen.getByText('Selected Text')).toBeInTheDocument()

    // Check if the color input is rendered with the initial color
    const colorInput = screen.getByLabelText('Custom:') as HTMLInputElement
    expect(colorInput.value).toBe('#ff0000')

    // Check if the preset colors are rendered
    const presetColors = screen.getAllByRole('button', { name: /Color / })
    expect(presetColors.length).toBe(24) // 24 preset colors (20 presets + 4 buttons)
  })

  it('calls onClose when the close button is clicked', () => {
    render(
      <ColorPickerModal
        editor={mockEditor as unknown as Editor}
        onClose={mockOnClose}
        initialColor="#ff0000"
      />
    )

    // Click the close button
    fireEvent.click(screen.getByLabelText('Close'))

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the cancel button is clicked', () => {
    render(
      <ColorPickerModal
        editor={mockEditor as unknown as Editor}
        onClose={mockOnClose}
        initialColor="#ff0000"
      />
    )

    // Click the cancel button
    fireEvent.click(screen.getByText('Cancel'))

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('inserts a color directive when the apply button is clicked', () => {
    render(
      <ColorPickerModal
        editor={mockEditor as unknown as Editor}
        onClose={mockOnClose}
        initialColor="green"
      />
    )

    // Click the apply button
    const applyButton = screen.getByText('Apply')
    fireEvent.click(applyButton)

    // Check if the editor methods were called
    expect(mockEditor.chain).toHaveBeenCalled()
    expect(mockEditor.focus).toHaveBeenCalled()
    expect(mockEditor.setMark).toHaveBeenCalledWith('textStyle', {
      color: 'green'
    })
    expect(mockEditor.run).toHaveBeenCalled()

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('updates the color when a preset color is clicked', () => {
    render(
      <ColorPickerModal
        editor={mockEditor as unknown as Editor}
        onClose={mockOnClose}
        initialColor="#ff0000"
      />
    )

    // Get all preset color buttons
    const presetColors = screen.getAllByRole('button', { name: /Color / })

    // Click the second preset color (orange)
    fireEvent.click(presetColors[1])

    // Check if the color input was updated
    const colorInput = screen.getByDisplayValue('dimgray') as HTMLInputElement
    expect(colorInput).toBeInTheDocument()
  })

  it('renders correctly with default color', () => {
    render(
      <ColorPickerModal
        editor={mockEditor as unknown as Editor}
        onClose={mockOnClose}
        initialColor="black"
      />
    )

    // Check if the modal title is rendered
    expect(screen.getByText('Text Color')).toBeInTheDocument()

    // Check if the selected text is displayed in the preview
    expect(screen.getByText('Selected Text')).toBeInTheDocument()

    // Check if the color input is rendered with the initial color
    const colorInput = screen.getByLabelText('Custom:') as HTMLInputElement
    expect(colorInput.value).toBe('black')

    // Check if the preset colors are rendered
    const presetColors = screen.getAllByRole('button', { name: /Color / })
    expect(presetColors.length).toBe(24) // 24 preset colors (20 presets + 4 buttons)
  })
})
