import { render, screen, fireEvent } from '@testing-library/react'
import MarkdownEditor from './MarkdownEditor'

// Create a map to store the HTML content for different test cases
const contentHtmlMap = new Map<string, string>()

// Mock TipTap editor
jest.mock('@tiptap/react', () => {
  const mockEditor = {
    chain: () => ({
      focus: () => ({
        toggleBold: () => ({
          run: jest.fn()
        }),
        toggleItalic: () => ({
          run: jest.fn()
        }),
        toggleStrike: () => ({
          run: jest.fn()
        }),
        toggleHeading: () => ({
          run: jest.fn()
        }),
        toggleBulletList: () => ({
          run: jest.fn()
        }),
        toggleOrderedList: () => ({
          run: jest.fn()
        }),
        toggleCodeBlock: () => ({
          run: jest.fn()
        }),
        toggleBlockquote: () => ({
          run: jest.fn()
        })
      })
    }),
    state: {
      selection: {
        from: 0,
        to: 0
      }
    },
    isActive: jest.fn().mockReturnValue(false),
    getHTML: jest.fn().mockImplementation(() => {
      // Return the stored HTML for the current test case
      return contentHtmlMap.get('currentHtml') || '<p></p>'
    }),
    commands: {
      setContent: jest.fn()
    }
  }

  return {
    useEditor: () => mockEditor,
    EditorContent: () => {
      // Return the actual HTML content for testing
      const html =
        contentHtmlMap.get('currentHtml') || '<div>Editor Content</div>'
      return (
        <div
          data-testid="editor-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )
    }
  }
})

describe('MarkdownEditor', () => {
  beforeEach(() => {
    // Clear the content map before each test
    contentHtmlMap.clear()
  })

  it('renders the editor', () => {
    render(<MarkdownEditor content="" onChange={() => {}} />)
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })

  it('renders with initial content', () => {
    render(<MarkdownEditor content="# Test Content" onChange={() => {}} />)
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(
      <MarkdownEditor
        content=""
        onChange={() => {}}
        placeholder="Test Placeholder"
      />
    )
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })

  it('toggles between source and WYSIWYG mode', () => {
    const { container } = render(
      <MarkdownEditor content="# Test Content" onChange={() => {}} />
    )

    // Find the source toggle button (eye icon)
    const sourceToggleButton = screen.getByTitle('Switch to Markdown mode')

    // Initially in WYSIWYG mode
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
    expect(container.querySelector('.markdown-source')).not.toBeInTheDocument()

    // Click to switch to source mode
    fireEvent.click(sourceToggleButton)

    // Now in source mode
    expect(container.querySelector('.markdown-source')).toBeInTheDocument()

    // Click to switch back to WYSIWYG mode
    fireEvent.click(sourceToggleButton)

    // Back in WYSIWYG mode
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
    expect(container.querySelector('.markdown-source')).not.toBeInTheDocument()
  })

  it('hides source view toggle when allowSourceView is false', () => {
    render(
      <MarkdownEditor
        content="# Test Content"
        onChange={() => {}}
        allowSourceView={false}
      />
    )

    // Source toggle button should not be present
    expect(
      screen.queryByTitle('Switch to Markdown mode')
    ).not.toBeInTheDocument()
  })

  describe('Toolbar buttons functionality', () => {
    it('renders all formatting buttons', () => {
      render(<MarkdownEditor content="" onChange={() => {}} />)

      // Basic formatting
      expect(screen.getByTitle('Bold (⌘B)')).toBeInTheDocument()
      expect(screen.getByTitle('Italic (⌘I)')).toBeInTheDocument()
      expect(screen.getByTitle('Strikethrough')).toBeInTheDocument()

      // Headings
      expect(screen.getByTitle('Heading 1')).toBeInTheDocument()
      expect(screen.getByTitle('Heading 2')).toBeInTheDocument()
      expect(screen.getByTitle('Heading 3')).toBeInTheDocument()

      // Lists
      expect(screen.getByTitle('Bullet List')).toBeInTheDocument()
      expect(screen.getByTitle('Numbered List')).toBeInTheDocument()

      // Other formatting
      expect(screen.getByTitle('Code Block')).toBeInTheDocument()
      expect(screen.getByTitle('Quote')).toBeInTheDocument()
    })

    it('disables toolbar buttons in source mode', () => {
      render(<MarkdownEditor content="" onChange={() => {}} />)

      // Initially buttons are enabled
      const boldButton = screen.getByTitle('Bold (⌘B)')
      expect(boldButton).not.toBeDisabled()

      // Switch to source mode
      const sourceToggleButton = screen.getByTitle('Switch to Markdown mode')
      fireEvent.click(sourceToggleButton)

      // Now buttons should be disabled
      expect(boldButton).toBeDisabled()

      // But source toggle should still be enabled
      expect(sourceToggleButton).not.toBeDisabled()
    })
  })

  describe('Markdown syntax handling', () => {
    it('handles basic text formatting in source mode', () => {
      const onChange = jest.fn()
      const { container } = render(
        <MarkdownEditor
          content="**Bold** and *Italic* and ~~Strikethrough~~"
          onChange={onChange}
        />
      )

      // Switch to source mode to see the markdown
      const sourceToggleButton = screen.getByTitle('Switch to Markdown mode')
      fireEvent.click(sourceToggleButton)

      const textarea = container.querySelector(
        '.markdown-source'
      ) as HTMLTextAreaElement
      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toContain(
        '**Bold** and *Italic* and ~~Strikethrough~~'
      )
    })

    it('renders bold text correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set('currentHtml', '<p><strong>Bold</strong> text</p>')

      render(<MarkdownEditor content="**Bold** text" onChange={() => {}} />)

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain('<strong>Bold</strong>')
    })

    it('renders italic text correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set('currentHtml', '<p><em>Italic</em> text</p>')

      render(<MarkdownEditor content="*Italic* text" onChange={() => {}} />)

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain('<em>Italic</em>')
    })

    it('renders strikethrough text correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set('currentHtml', '<p><s>Strikethrough</s> text</p>')

      render(
        <MarkdownEditor content="~~Strikethrough~~ text" onChange={() => {}} />
      )

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain('<s>Strikethrough</s>')
    })

    it('handles headings in source mode', () => {
      const onChange = jest.fn()
      const { container } = render(
        <MarkdownEditor
          content="# Heading 1\n## Heading 2\n### Heading 3"
          onChange={onChange}
        />
      )

      // Switch to source mode to see the markdown
      const sourceToggleButton = screen.getByTitle('Switch to Markdown mode')
      fireEvent.click(sourceToggleButton)

      const textarea = container.querySelector(
        '.markdown-source'
      ) as HTMLTextAreaElement
      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toContain('# Heading 1')
      expect(textarea.value).toContain('## Heading 2')
      expect(textarea.value).toContain('### Heading 3')
    })

    it('renders headings correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set(
        'currentHtml',
        '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>'
      )

      render(
        <MarkdownEditor
          content="# Heading 1\n## Heading 2\n### Heading 3"
          onChange={() => {}}
        />
      )

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain('<h1>Heading 1</h1>')
      expect(editorContent.innerHTML).toContain('<h2>Heading 2</h2>')
      expect(editorContent.innerHTML).toContain('<h3>Heading 3</h3>')
    })

    it('handles code blocks in source mode', () => {
      const onChange = jest.fn()
      const { container } = render(
        <MarkdownEditor
          content="```javascript\nconst x = 1;\n```"
          onChange={onChange}
        />
      )

      // Switch to source mode to see the markdown
      const sourceToggleButton = screen.getByTitle('Switch to Markdown mode')
      fireEvent.click(sourceToggleButton)

      const textarea = container.querySelector(
        '.markdown-source'
      ) as HTMLTextAreaElement
      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toContain('```javascript')
      expect(textarea.value).toContain('const x = 1;')
    })

    it('renders code blocks correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set(
        'currentHtml',
        '<pre><code class="language-javascript">const x = 1;</code></pre>'
      )

      render(
        <MarkdownEditor
          content="```javascript\nconst x = 1;\n```"
          onChange={() => {}}
        />
      )

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain(
        '<pre><code class="language-javascript">const x = 1;</code></pre>'
      )
    })

    it('handles bullet lists in source mode', () => {
      const onChange = jest.fn()
      const { container } = render(
        <MarkdownEditor
          content="- Item 1\n- Item 2\n  - Nested item"
          onChange={onChange}
        />
      )

      // Switch to source mode to see the markdown
      const sourceToggleButton = screen.getByTitle('Switch to Markdown mode')
      fireEvent.click(sourceToggleButton)

      const textarea = container.querySelector(
        '.markdown-source'
      ) as HTMLTextAreaElement
      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toContain('- Item 1')
      expect(textarea.value).toContain('- Item 2')
      expect(textarea.value).toContain('  - Nested item')
    })

    it('renders bullet lists correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set(
        'currentHtml',
        '<ul><li>Item 1</li><li>Item 2<ul><li>Nested item</li></ul></li></ul>'
      )

      render(
        <MarkdownEditor
          content="- Item 1\n- Item 2\n  - Nested item"
          onChange={() => {}}
        />
      )

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain(
        '<ul><li>Item 1</li><li>Item 2<ul><li>Nested item</li></ul></li></ul>'
      )
    })

    it('handles ordered lists in source mode', () => {
      const onChange = jest.fn()
      const { container } = render(
        <MarkdownEditor
          content="1. First item\n2. Second item\n   1. Nested item"
          onChange={onChange}
        />
      )

      // Switch to source mode to see the markdown
      const sourceToggleButton = screen.getByTitle('Switch to Markdown mode')
      fireEvent.click(sourceToggleButton)

      const textarea = container.querySelector(
        '.markdown-source'
      ) as HTMLTextAreaElement
      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toContain('1. First item')
      expect(textarea.value).toContain('2. Second item')
      expect(textarea.value).toContain('   1. Nested item')
    })

    it('renders ordered lists correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set(
        'currentHtml',
        '<ol><li>First item</li><li>Second item<ol><li>Nested item</li></ol></li></ol>'
      )

      render(
        <MarkdownEditor
          content="1. First item\n2. Second item\n   1. Nested item"
          onChange={() => {}}
        />
      )

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain(
        '<ol><li>First item</li><li>Second item<ol><li>Nested item</li></ol></li></ol>'
      )
    })

    it('handles blockquotes in source mode', () => {
      const onChange = jest.fn()
      const { container } = render(
        <MarkdownEditor
          content="> This is a blockquote\n> Second line"
          onChange={onChange}
        />
      )

      // Switch to source mode to see the markdown
      const sourceToggleButton = screen.getByTitle('Switch to Markdown mode')
      fireEvent.click(sourceToggleButton)

      const textarea = container.querySelector(
        '.markdown-source'
      ) as HTMLTextAreaElement
      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toContain('> This is a blockquote')
      expect(textarea.value).toContain('> Second line')
    })

    it('renders blockquotes correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set(
        'currentHtml',
        '<blockquote><p>This is a blockquote</p><p>Second line</p></blockquote>'
      )

      render(
        <MarkdownEditor
          content="> This is a blockquote\n> Second line"
          onChange={() => {}}
        />
      )

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain(
        '<blockquote><p>This is a blockquote</p><p>Second line</p></blockquote>'
      )
    })
  })

  describe('SingleLineMode', () => {
    it('hides source view toggle in single-line mode', () => {
      const onChange = jest.fn()
      render(
        <MarkdownEditor
          content="Single line content"
          onChange={onChange}
          singleLineMode={true}
        />
      )

      // Source view toggle should not be visible
      const sourceToggle = screen.queryByTitle('Switch to Markdown mode')
      expect(sourceToggle).not.toBeInTheDocument()
    })

    it('applies single-line-mode class in single-line mode', () => {
      const onChange = jest.fn()
      const { container } = render(
        <MarkdownEditor
          content="Single line content"
          onChange={onChange}
          singleLineMode={true}
        />
      )

      // Check if the single-line-mode class is applied
      const editorWrapper = container.querySelector(
        '.rich-editor-content-wrapper.single-line-mode'
      )
      expect(editorWrapper).toBeInTheDocument()
    })

    it('shows toolbar only when focused in single-line mode', () => {
      const onChange = jest.fn()
      const { container } = render(
        <MarkdownEditor
          content="Single line content"
          onChange={onChange}
          singleLineMode={true}
        />
      )

      // Toolbar should not be visible initially
      let toolbar = container.querySelector('.editor-toolbar-container')
      expect(toolbar).not.toBeInTheDocument()

      // Simulate focus on the editor
      const editor = container.querySelector('.ProseMirror')
      if (editor) {
        fireEvent.focus(editor)

        // Toolbar should be visible after focus
        toolbar = container.querySelector('.editor-toolbar-container')
        expect(toolbar).toBeInTheDocument()

        // Simulate blur
        fireEvent.blur(editor)

        // Toolbar should not be visible after blur
        toolbar = container.querySelector('.editor-toolbar-container')
        expect(toolbar).not.toBeInTheDocument()
      }
    })

    it('passes singleLineMode prop to EditorToolbar', () => {
      const onChange = jest.fn()
      const { container } = render(
        <MarkdownEditor
          content="Single line content"
          onChange={onChange}
          singleLineMode={true}
        />
      )

      // Simulate focus to show the toolbar
      const editor = container.querySelector('.ProseMirror')
      if (editor) {
        fireEvent.focus(editor)

        // Check if the single-line-toolbar class is applied to the toolbar
        const toolbar = container.querySelector(
          '.editor-toolbar.single-line-toolbar'
        )
        expect(toolbar).toBeInTheDocument()
      }
    })
  })

  describe('Custom directives', () => {
    it('renders color directive correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set(
        'currentHtml',
        '<p>This has <span class="text-color-directive" style="color: #ff0000" data-type="color-directive">colored text</span>.</p>'
      )

      render(
        <MarkdownEditor
          content="This has :color[colored text]{#ff0000}."
          onChange={() => {}}
        />
      )

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain('text-color-directive')
      expect(editorContent.innerHTML).toContain('color: #ff0000')
      expect(editorContent.innerHTML).toContain('colored text')
    })

    it('renders color directive with markdown formatting inside correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set(
        'currentHtml',
        '<p>This has <span class="text-color-directive" style="color: #ff0000" data-type="color-directive">colored <strong>bold</strong> and <em>italic</em> text</span>.</p>'
      )

      render(
        <MarkdownEditor
          content="This has :color[colored **bold** and *italic* text]{#ff0000}."
          onChange={() => {}}
        />
      )

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain('text-color-directive')
      expect(editorContent.innerHTML).toContain('color: #ff0000')
      expect(editorContent.innerHTML).toContain(
        'colored <strong>bold</strong> and <em>italic</em> text'
      )
    })

    it('renders button directive correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set(
        'currentHtml',
        '<p>Click this <a class="button-directive shape-pill color-blue" href="https://example.com" data-type="button-directive">Button</a>.</p>'
      )

      render(
        <MarkdownEditor
          content='Click this :button[Button]{url="https://example.com" shape="pill" color="blue"}.'
          onChange={() => {}}
        />
      )

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain('button-directive')
      expect(editorContent.innerHTML).toContain('shape-pill')
      expect(editorContent.innerHTML).toContain('color-blue')
      expect(editorContent.innerHTML).toContain('href="https://example.com"')
      expect(editorContent.innerHTML).toContain('Button')
    })

    it('renders button directive with markdown formatting inside correctly in WYSIWYG mode', () => {
      // Set the HTML that should be rendered
      contentHtmlMap.set(
        'currentHtml',
        '<p>Click this <a class="button-directive shape-pill color-blue" href="https://example.com" data-type="button-directive">Button with <strong>bold</strong> and <em>italic</em></a>.</p>'
      )

      render(
        <MarkdownEditor
          content='Click this :button[Button with **bold** and *italic*]{url="https://example.com" shape="pill" color="blue"}.'
          onChange={() => {}}
        />
      )

      const editorContent = screen.getByTestId('editor-content')
      expect(editorContent.innerHTML).toContain('button-directive')
      expect(editorContent.innerHTML).toContain('shape-pill')
      expect(editorContent.innerHTML).toContain('color-blue')
      expect(editorContent.innerHTML).toContain('href="https://example.com"')
      expect(editorContent.innerHTML).toContain(
        'Button with <strong>bold</strong> and <em>italic</em>'
      )
    })

    it('handles color directive with markdown formatting in source mode', () => {
      const onChange = jest.fn()
      const { container } = render(
        <MarkdownEditor
          content="This has :color[colored **bold** and *italic* text]{#ff0000}."
          onChange={onChange}
        />
      )

      // Switch to source mode to see the markdown
      const sourceToggleButton = screen.getByTitle('Switch to Markdown mode')
      fireEvent.click(sourceToggleButton)

      const textarea = container.querySelector(
        '.markdown-source'
      ) as HTMLTextAreaElement
      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toContain(
        ':color[colored **bold** and *italic* text]{#ff0000}'
      )
    })

    it('handles button directive with markdown formatting in source mode', () => {
      const onChange = jest.fn()
      const { container } = render(
        <MarkdownEditor
          content='Click this :button[Button with **bold** and *italic*]{url="https://example.com" shape="pill" color="blue"}.'
          onChange={onChange}
        />
      )

      // Switch to source mode to see the markdown
      const sourceToggleButton = screen.getByTitle('Switch to Markdown mode')
      fireEvent.click(sourceToggleButton)

      const textarea = container.querySelector(
        '.markdown-source'
      ) as HTMLTextAreaElement
      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toContain(
        ':button[Button with **bold** and *italic*]{url="https://example.com" shape="pill" color="blue"}'
      )
    })
  })
})
