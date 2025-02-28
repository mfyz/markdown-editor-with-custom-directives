import { render, screen, fireEvent } from '@testing-library/react'
import ButtonPickerModal from './ButtonPickerModal'

// Mock editor
const mockEditor = {
  chain: jest.fn().mockReturnThis(),
  focus: jest.fn().mockReturnThis(),
  deleteRange: jest.fn().mockReturnThis(),
  insertContent: jest.fn().mockReturnThis(),
  run: jest.fn(),
  state: {
    selection: {
      from: 0,
      to: 5
    },
    doc: {
      textBetween: jest.fn().mockReturnValue('Test'),
      nodesBetween: jest.fn((_from, _to, callback) => {
        callback(
          {
            type: { name: 'text' },
            marks: [{ type: { name: 'link' } }],
            text: 'Button Text',
            nodeSize: 15
          },
          10
        )
        return false
      })
    }
  }
}

describe('ButtonPickerModal', () => {
  const onCloseMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with default values', () => {
    render(
      <ButtonPickerModal editor={mockEditor as any} onClose={onCloseMock} />
    )

    // Check if modal elements are rendered
    expect(screen.getByText('Add Button')).toBeInTheDocument()
    expect(screen.getByLabelText('Button Text')).toBeInTheDocument()
    expect(screen.getByLabelText('URL')).toBeInTheDocument()
  })

  it('closes modal when Cancel is clicked', () => {
    render(
      <ButtonPickerModal editor={mockEditor as any} onClose={onCloseMock} />
    )

    // Click the Cancel button
    fireEvent.click(screen.getByText('Cancel'))

    // Check if onClose was called
    expect(onCloseMock).toHaveBeenCalled()
  })

  it('renders in edit mode without button text field', () => {
    render(
      <ButtonPickerModal
        editor={mockEditor as any}
        onClose={onCloseMock}
        isEditMode={true}
        initialUrl="https://example.com"
        initialStyle="pill-blue"
        initialText="Edit Button Text"
        buttonPosition={{ from: 10, to: 25 }}
      />
    )

    // Check if modal elements are rendered with edit mode title
    expect(screen.getByText('Edit Button')).toBeInTheDocument()
    expect(screen.queryByLabelText('Button Text')).not.toBeInTheDocument()
    expect(screen.getByLabelText('URL')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument()
    expect(screen.getByText('Edit Button Text')).toBeInTheDocument()
  })

  it('uses nodesBetween when in edit mode', () => {
    const buttonPosition = { from: 10, to: 25 }

    render(
      <ButtonPickerModal
        editor={mockEditor as any}
        onClose={onCloseMock}
        isEditMode={true}
        initialUrl="https://example.com"
        initialStyle="pill-blue"
        initialText="Edit Button Text"
        buttonPosition={buttonPosition}
      />
    )

    // Click the Apply button
    fireEvent.click(screen.getByText('Apply'))

    // Check that the editor chain was called
    expect(mockEditor.chain).toHaveBeenCalled()
    expect(mockEditor.focus).toHaveBeenCalled()
    expect(mockEditor.state.doc.nodesBetween).toHaveBeenCalled()
    expect(mockEditor.insertContent).toHaveBeenCalled() // insertContent is used in edit mode
    expect(mockEditor.run).toHaveBeenCalled()
    expect(onCloseMock).toHaveBeenCalled()
  })

  it('applies button in add mode', () => {
    render(
      <ButtonPickerModal editor={mockEditor as any} onClose={onCloseMock} />
    )

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Button Text'), {
      target: { value: 'New Button' }
    })
    fireEvent.change(screen.getByLabelText('URL'), {
      target: { value: 'https://example.com' }
    })

    // Click the Apply button
    fireEvent.click(screen.getByText('Apply'))

    // Check that the editor chain was called
    expect(mockEditor.chain).toHaveBeenCalled()
    expect(mockEditor.focus).toHaveBeenCalled()
    expect(mockEditor.deleteRange).toHaveBeenCalled()
    expect(mockEditor.insertContent).not.toHaveBeenCalled()
    expect(mockEditor.run).toHaveBeenCalled()
    expect(onCloseMock).toHaveBeenCalled()
  })
})
