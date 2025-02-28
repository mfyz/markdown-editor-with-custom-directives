import { render, screen, fireEvent } from '@testing-library/react'
import LinkModal from './LinkModal'
import { Editor } from '@tiptap/react'

// Mock the editor
const mockEditor = {
  chain: jest.fn(() => ({
    focus: jest.fn().mockReturnThis(),
    extendMarkRange: jest.fn().mockReturnThis(),
    unsetLink: jest.fn().mockReturnThis(),
    setLink: jest.fn().mockReturnThis(),
    run: jest.fn()
  })),
  focus: jest.fn(),
  setLink: jest.fn(),
  run: jest.fn(),
  commandManager: {},
  extensionManager: {},
  css: '',
  schema: {},
  view: {},
  isFocused: jest.fn().mockReturnValue(true),
  isInitialized: jest.fn().mockReturnValue(true),
  extensionStorage: {},
  options: {},
  storage: {},
  commands: {},
  can: jest.fn().mockReturnValue(true),
  injectCSS: jest.fn(),
  setOptions: jest.fn(),
  setEditable: jest.fn(),
  isEditable: jest.fn().mockReturnValue(true),
  state: {
    selection: {
      from: 1,
      to: 5
    }
  },
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
  getAttributes: jest.fn().mockReturnValue({}),
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

describe('LinkModal', () => {
  const mockProps = {
    editor: mockEditor as unknown as Editor,
    onClose: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockEditor.getAttributes.mockReturnValue({})
  })

  it('renders in add mode when no existing link', () => {
    render(<LinkModal {...mockProps} />)
    expect(screen.getByText('Add Link')).toBeInTheDocument()
    expect(screen.queryByTitle('Remove link')).not.toBeInTheDocument()
  })

  it('renders in edit mode with existing link', () => {
    mockEditor.getAttributes.mockReturnValue({ href: 'https://example.com' })
    render(<LinkModal {...mockProps} />)

    expect(screen.getByText('Edit Link')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument()
    expect(screen.getByTitle('Remove link')).toBeInTheDocument()
  })

  it('adds https:// protocol if missing', () => {
    const setLinkMock = jest.fn()
    const mockEditorWithSpy = {
      ...mockEditor,
      chain: () => ({
        focus: () => ({
          setLink: ({ href }: { href: string }) => ({
            run: () => {
              setLinkMock(href)
            }
          })
        })
      })
    }

    render(
      <LinkModal
        {...mockProps}
        editor={mockEditorWithSpy as unknown as Editor}
      />
    )

    const input = screen.getByPlaceholderText('https://example.com')
    fireEvent.change(input, { target: { value: 'example.com' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    expect(setLinkMock).not.toHaveBeenCalledWith('example.com')
    expect(setLinkMock).not.toHaveBeenCalledWith('https://example.com')
  })

  it('removes link when URL is empty', () => {
    const unsetLinkMock = jest.fn()
    const mockEditorWithSpy = {
      ...mockEditor,
      chain: () => ({
        focus: () => ({
          extendMarkRange: () => ({
            unsetLink: () => ({
              run: unsetLinkMock
            })
          })
        })
      })
    }

    render(
      <LinkModal
        {...mockProps}
        editor={mockEditorWithSpy as unknown as Editor}
      />
    )

    const input = screen.getByPlaceholderText('https://example.com')
    fireEvent.change(input, { target: { value: '' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    expect(unsetLinkMock).toHaveBeenCalled()
  })

  it('preserves existing protocol in URL', () => {
    const setLinkMock = jest.fn()
    const mockEditorWithSpy = {
      ...mockEditor,
      chain: () => ({
        focus: () => ({
          setLink: ({ href }: { href: string }) => ({
            run: () => {
              setLinkMock(href)
            }
          })
        })
      })
    }

    render(
      <LinkModal
        {...mockProps}
        editor={mockEditorWithSpy as unknown as Editor}
      />
    )

    const input = screen.getByPlaceholderText('https://example.com')
    fireEvent.change(input, { target: { value: 'http://example.com' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    expect(setLinkMock).toHaveBeenCalledWith('http://example.com')
  })

  it('calls onClose when close button is clicked', () => {
    render(<LinkModal {...mockProps} />)

    const closeButton = screen.getByTitle('Close')
    fireEvent.click(closeButton)

    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('calls onClose when remove button is clicked', () => {
    mockEditor.getAttributes.mockReturnValue({ href: 'https://example.com' })
    render(<LinkModal {...mockProps} />)

    const removeButton = screen.getByTitle('Remove link')
    fireEvent.click(removeButton)

    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('calls onClose after saving link', () => {
    render(<LinkModal {...mockProps} />)

    const input = screen.getByPlaceholderText('https://example.com')
    fireEvent.change(input, { target: { value: 'https://example.com' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('submits link', () => {
    const setLinkMock = jest.fn()
    const mockEditorWithSpy = {
      ...mockEditor,
      chain: () => ({
        focus: () => ({
          setLink: ({ href }: { href: string }) => ({
            run: () => {
              setLinkMock(href)
            }
          })
        })
      })
    }

    render(
      <LinkModal
        {...mockProps}
        editor={mockEditorWithSpy as unknown as Editor}
      />
    )

    const input = screen.getByPlaceholderText('https://example.com')
    fireEvent.change(input, { target: { value: 'https://example.com' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    expect(setLinkMock).toHaveBeenCalledWith('https://example.com')
  })
})
