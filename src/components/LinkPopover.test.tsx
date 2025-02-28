import { render, screen, fireEvent } from '@testing-library/react'
import LinkPopover from './LinkPopover'
import { Editor } from '@tiptap/react'

// Mock the editor
const mockEditor = {
  chain: jest.fn(() => ({
    focus: jest.fn().mockReturnThis(),
    extendMarkRange: jest.fn().mockReturnThis(),
    unsetLink: jest.fn().mockReturnThis(),
    run: jest.fn()
  })),
  focus: jest.fn(),
  extendMarkRange: jest.fn().mockReturnThis(),
  unsetLink: jest.fn().mockReturnThis(),
  run: jest.fn(),
  commandManager: {},
  extensionManager: {},
  css: '',
  schema: {},
  view: {
    dispatch: jest.fn(),
    state: {
      doc: {
        toJSON: jest.fn().mockReturnValue({})
      }
    }
  },
  state: {
    doc: {
      toJSON: jest.fn().mockReturnValue({})
    }
  },
  isFocused: jest.fn().mockReturnValue(true),
  isInitialized: jest.fn().mockReturnValue(true),
  getAttributes: jest.fn(),
  getMarkAttrs: jest.fn(),
  getMarkRange: jest.fn(),
  getSelection: jest.fn(),
  getSelectionRange: jest.fn(),
  getSelectionText: jest.fn(),
  getSelectionNode: jest.fn(),
  getSelectionParentNode: jest.fn(),
  extensionStorage: {},
  options: {},
  storage: {},
  commands: {},
  can: jest.fn().mockReturnValue(true),
  injectCSS: jest.fn(),
  setOptions: jest.fn(),
  setEditable: jest.fn(),
  isEditable: jest.fn().mockReturnValue(true),
  registerPlugin: jest.fn(),
  unregisterPlugin: jest.fn(),
  createExtensionManager: jest.fn(),
  createCommandManager: jest.fn(),
  createSchema: jest.fn(),
  createView: jest.fn(),
  createNodeViews: jest.fn(),
  prependClass: jest.fn(),
  isCapturingTransaction: jest.fn().mockReturnValue(false),
  capturedTransaction: {},
  captureTransaction: jest.fn(),
  dispatchTransaction: jest.fn(),
  isActive: jest.fn(),
  getJSON: jest.fn(),
  getHTML: jest.fn(),
  getText: jest.fn(),
  isEmpty: jest.fn(),
  getCharacterCount: jest.fn(),
  destroy: jest.fn(),
  isDestroyed: jest.fn().mockReturnValue(false),
  $node: jest.fn(),
  $nodes: jest.fn(),
  $pos: jest.fn(),
  getNodeByPos: jest.fn(),
  getNodeByContent: jest.fn(),
  getNodeByName: jest.fn(),
  getNodeByType: jest.fn(),
  getNodesByName: jest.fn(),
  getNodesByType: jest.fn(),
  getNodesByContent: jest.fn(),
  $doc: {},
  callbacks: {},
  on: jest.fn(),
  emit: jest.fn(),
  off: jest.fn(),
  setContent: jest.fn(),
  getSelectedText: jest.fn(),
  once: jest.fn(),
  removeAllListeners: jest.fn()
}

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
