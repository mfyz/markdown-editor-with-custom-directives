import { render, screen, fireEvent } from '@testing-library/react'
import LinkPopover from './LinkPopover'
import { Editor } from '@tiptap/react'

// Mock the editor
const mockEditor = {
  chain: jest.fn().mockReturnThis(),
  focus: jest.fn().mockReturnThis(),
  deleteRange: jest.fn().mockReturnThis(),
  insertContent: jest.fn().mockReturnThis(),
  run: jest.fn(),
  state: {
    doc: {
      nodesBetween: jest.fn((_from, _to, callback) => {
        callback(
          {
            type: { name: 'text' },
            marks: [{ type: { name: 'link' } }],
            text: 'Link Text',
            nodeSize: 10
          },
          0
        )
        return false
      })
    },
    selection: {
      from: 0,
      to: 5
    }
  }
} as unknown as Editor

describe('LinkPopover', () => {
  const mockProps = {
    editor: mockEditor as unknown as Editor,
    url: 'https://example.com',
    onEdit: jest.fn(),
    onClose: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with the provided URL', () => {
    render(<LinkPopover {...mockProps} />)

    const urlElement = screen.getByText('https://example.com')
    expect(urlElement).toBeInTheDocument()
    expect(urlElement.closest('a')).toHaveAttribute(
      'href',
      'https://example.com'
    )
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<LinkPopover {...mockProps} />)

    const editButton = screen.getByTitle('Edit link')
    fireEvent.click(editButton)

    expect(mockProps.onEdit).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when delete button is clicked', () => {
    render(<LinkPopover {...mockProps} />)

    const deleteButton = screen.getByTitle('Remove link')
    fireEvent.click(deleteButton)

    expect(mockEditor.chain).toHaveBeenCalled()
    expect(mockEditor.state.doc.nodesBetween).toHaveBeenCalled()
    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('opens URL in new tab when clicked', () => {
    const mockOpen = jest.fn()
    window.open = mockOpen

    render(<LinkPopover {...mockProps} />)

    const urlLink = screen.getByText('https://example.com')
    fireEvent.click(urlLink)

    expect(mockOpen).toHaveBeenCalledWith(
      'https://example.com',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('shows tooltips on hover', async () => {
    render(<LinkPopover {...mockProps} />)

    const editButton = screen.getByTitle('Edit link')
    const deleteButton = screen.getByTitle('Remove link')

    expect(editButton).toHaveAttribute('title', 'Edit link')
    expect(deleteButton).toHaveAttribute('title', 'Remove link')
  })
})
