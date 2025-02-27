import { useState } from 'react'
import './App.css'
import MarkdownEditor from './components/MarkdownEditor'

function App() {
  const [markdown, setMarkdown] = useState('')

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown)
  }

  const kitchenSinkMarkdown = `# Markdown Kitchen Sink Example

## Basic Formatting

This is a paragraph with **bold text**, *italic text*, and ~~strikethrough text~~. You can also use __bold__ and _italic_ syntax.

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
> 
> It can span multiple lines.
>
> > And can be nested.

## Code

Inline \`code\` can be added with backticks.

\`\`\`javascript
// Code blocks can include syntax highlighting
function helloWorld() {
  console.log('Hello, world!');
}
\`\`\`

## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Horizontal Rule

---

## Task Lists

- [x] Completed task
- [ ] Incomplete task
- [ ] Another incomplete task

## Long Paragraph for Scrolling

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Markdown Editor</h1>
      </header>
      <main className="app-main">
        <div className="editor-container">
          <MarkdownEditor
            initialContent={kitchenSinkMarkdown}
            onChange={handleMarkdownChange}
            placeholder="Start writing..."
          />
        </div>
      </main>
    </div>
  )
}

export default App
