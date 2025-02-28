import { render, screen, fireEvent } from '@testing-library/react'
import EditorToolbar from './EditorToolbar'
import { Editor } from '@tiptap/react'

describe('EditorToolbar', () => {
  const mockEditor = {
    chain: jest.fn().mockReturnThis(),
    focus: jest.fn(),
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
    getAttributes: jest.fn(),
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
  const onShowLinkModal = jest.fn()

  beforeEach(() => {
    render(
      <EditorToolbar
        editor={mockEditor as unknown as Editor}
        onShowLinkModal={onShowLinkModal}
      />
    )
  })

  test('renders toolbar', () => {
    expect(screen.getByTitle('Add Link')).toBeInTheDocument()
  })

  test('opens link modal on button click', () => {
    fireEvent.click(screen.getByTitle('Add Link'))
    expect(onShowLinkModal).toHaveBeenCalled()
  })
})
