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
      textBetween: jest.fn().mockReturnValue('Test')
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
    expect(screen.getByText('Button Settings')).toBeInTheDocument()
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
})
