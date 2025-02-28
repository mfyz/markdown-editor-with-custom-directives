import { render, screen, fireEvent } from '@testing-library/react'
import ButtonPopover from './ButtonPopover'
import { Editor } from '@tiptap/react'

// Mock the Editor
jest.mock('@tiptap/react', () => {
  const originalModule = jest.requireActual('@tiptap/react')
  return {
    __esModule: true,
    ...originalModule,
    Editor: jest.fn()
  }
})

describe('ButtonPopover', () => {
  const mockEditor = {
    chain: jest.fn().mockReturnThis(),
    focus: jest.fn().mockReturnThis(),
    deleteRange: jest.fn().mockReturnThis(),
    run: jest.fn(),
    state: {
      doc: {
        nodesBetween: jest.fn((_from, _to, callback) => {
          callback({ type: { name: 'buttonDirective' } }, 0)
          return false
        })
      },
      selection: {
        from: 0,
        to: 5
      }
    }
  } as unknown as Editor

  const mockProps = {
    editor: mockEditor,
    data: {
      url: 'https://example.com',
      shape: 'rect',
      color: 'red'
    },
    onEdit: jest.fn(),
    onClose: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with the provided URL', () => {
    render(<ButtonPopover {...mockProps} />)

    const urlElement = screen.getByText('https://example.com')
    expect(urlElement).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<ButtonPopover {...mockProps} />)

    const editButton = screen.getByTitle('Edit button')
    fireEvent.click(editButton)

    expect(mockProps.onEdit).toHaveBeenCalledTimes(1)
  })

  it('deletes the button and calls onClose when delete button is clicked', () => {
    render(<ButtonPopover {...mockProps} />)

    const deleteButton = screen.getByTitle('Remove button')
    fireEvent.click(deleteButton)

    expect(mockEditor.chain).toHaveBeenCalled()
    expect(mockEditor.state.doc.nodesBetween).toHaveBeenCalled()
    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('does not render URL section if URL is #', () => {
    const propsWithHashUrl = {
      ...mockProps,
      data: {
        ...mockProps.data,
        url: '#'
      }
    }

    render(<ButtonPopover {...propsWithHashUrl} />)

    expect(screen.queryByText('#')).not.toBeInTheDocument()
  })
})
