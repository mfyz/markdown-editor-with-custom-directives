import { useState } from 'react'
import './App.css'
import MarkdownEditor from './components/MarkdownEditor'
import MarkdownRenderer from './components/MarkdownRenderer'

const exampleSingleLine =
  'This is a :color[single *italic* line]{#ff0000} editor with [link](https://example.com), **bold** and *italic* text :button[Learn More]{url=https://example.com/learn shape=rounded color=purple} '

const exampleFull = `:button[Primary Button]{url=https://example.com shape=pill color=blue} and [link the](https://sanane.com) top

# Markdown Editor Example

## Custom Button Examples

Here are some button examples with different styles:

:button[Primary Button]{url=https://example.com shape=pill color=blue}

:button[Rectangle Green]{url=https://example.com/green shape=rect color=green}

:button[Rounded Purple]{url=https://example.com/purple shape=rounded color=purple}

:button[Rectangle Red]{url=https://example.com/red shape=rect color=red}

## Custom Color Examples

This text has :color[custom colors]{#ff0000} that can be applied to any :color[part of the text]{#3b82f6}.

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
`

function App() {
  // State for the single-line editor
  const [singleLineMarkdown, setSingleLineMarkdown] =
    useState(exampleSingleLine)

  // State for the main editor
  const [markdown, setMarkdown] = useState(exampleFull)

  return (
    <div className="app-container">
      <h1>Markdown Editor Examples</h1>

      <section className="example-section">
        <h2>Placeholder</h2>
        <div className="editor-container single-line-container">
          <MarkdownEditor
            content={''}
            onChange={setSingleLineMarkdown}
            placeholder="Enter a single line of text..."
            singleLineMode={true}
          />
        </div>
      </section>

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
          <h3>Preview with Renderer Method:</h3>
          <div style={{ backgroundColor: '#efefef', padding: '5px 20px' }}>
            <MarkdownRenderer content={singleLineMarkdown} />
          </div>
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
