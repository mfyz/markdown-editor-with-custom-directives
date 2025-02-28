import { useState } from 'react'
import './App.css'
import MarkdownEditor from './components/MarkdownEditor'

function App() {
  // State for the main editor
  const [markdown, setMarkdown] = useState(`# Markdown Kitchen Sink Example

## Basic Formatting

This is a paragraph with **bold text**, *italic text*, and ~~strikethrough text~~. You can also use __bold__ and _italic_ syntax.

Lorem ipsum [my link](https://www.google.com) dolor sit amet, consectetur adipiscing elit.

[Another](https://www.super-long-link-that-will-overflow-the-popover.com)

## Custom Directives

### Text Color

You can add colored text using the :color[text]{#color} directive:

:color[This text is red]{#ff0000}

:color[This text is blue]{#0000ff}

:color[This text is green]{#00ff00}

## Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Lists

### Unordered Lists

- Item 1
- Item 2
  - Nested item 1
  - Nested item 2
- Item 3

### Ordered Lists

1. First item
2. Second item
   1. Nested item 1
   2. Nested item 2
3. Third item

## Links and Images

[Visit GitHub](https://github.com)

![Placeholder Image](https://via.placeholder.com/150)

## Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> And have multiple paragraphs.

## Code

Inline \`code\` can be added with backticks.

\`\`\`javascript
// Code blocks can be added with triple backticks
function example() {
  console.log('Hello, world!');
}
\`\`\`

## Horizontal Rules

---

## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Task Lists

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
`)

  // State for the single-line editor
  const [singleLineMarkdown, setSingleLineMarkdown] = useState(
    'This is a :color[single line]{#ff0000} editor with **bold** and *italic* text and a [link](https://example.com)'
  )

  return (
    <div className="app-container">
      <h1>Markdown Editor Examples</h1>

      <section className="example-section">
        <h2>Single-Line Mode</h2>
        <p className="example-description">
          A compact editor for single-line content like titles, descriptions, or
          short comments.
        </p>
        <div className="editor-container single-line-container">
          <MarkdownEditor
            content={singleLineMarkdown}
            onChange={setSingleLineMarkdown}
            placeholder="Enter a single line of text..."
            singleLineMode={true}
          />
        </div>
        <div className="output-preview">
          <h3>Output:</h3>
          <pre>{singleLineMarkdown}</pre>
        </div>
      </section>

      <section className="example-section">
        <h2>Full-Featured Editor</h2>
        <p className="example-description">
          A complete markdown editor with all formatting options and source view
          toggle.
        </p>
        <div className="editor-container">
          <MarkdownEditor
            content={markdown}
            onChange={setMarkdown}
            placeholder="Write something..."
          />
        </div>
        <div className="output-preview">
          <h3>Output:</h3>
          <pre className="full-featured-output">{markdown}</pre>
        </div>
      </section>
    </div>
  )
}

export default App
