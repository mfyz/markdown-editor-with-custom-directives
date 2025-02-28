# Markdown Editor with Color and Button Directives

A React markdown editor with custom directives for colored text and styled buttons.

## Features

- Full-featured markdown editor with preview
- Custom directives for colored text and styled buttons
- Dual-pane layout with live preview
- Toolbar with formatting options
- Responsive design

## Installation

```bash
npm install @mfyz/markdown-editor-with-color-and-button
```

## Usage

### Editor Component

```jsx
import { MarkdownEditor } from '@mfyz/markdown-editor-with-color-and-button'
import '@mfyz/markdown-editor-with-color-and-button/dist/styles/index.css'

function App() {
  const [markdown, setMarkdown] = useState('# Hello World')

  return (
    <div className="app">
      <MarkdownEditor
        content={markdown}
        onChange={setMarkdown}
        placeholder="Start writing..."
        allowSourceView={true}
      />
    </div>
  )
}
```

### Renderer Component

If you only need to render markdown with the custom directives:

```jsx
import { MarkdownRenderer } from '@mfyz/markdown-editor-with-color-and-button'
import '@mfyz/markdown-editor-with-color-and-button/dist/styles/index.css'

function MarkdownDisplay({ content }) {
  return (
    <div className="markdown-display">
      <MarkdownRenderer content={content} />
    </div>
  )
}
```

## Custom Directives

### Color Directive

Format: `:color[text]{#hexcolor}`

Example:

```
This is :color[colored text]{#ff0000}.
```

### Button Directive

Format: `:button[button text]{url="https://example.com" shape="pill" color="blue"}`

Available shapes: `pill`, `rounded`, `rect`
Available colors: `purple`, `blue`, `green`, `red`, `yellow`, `gray`, `black`

Example:

```
Click this :button[Button]{url="https://example.com" shape="pill" color="blue"}.
```

## API Reference

### MarkdownEditor Props

| Prop            | Type     | Description                                                           |
| --------------- | -------- | --------------------------------------------------------------------- |
| content         | string   | The markdown content                                                  |
| onChange        | function | Callback when content changes                                         |
| placeholder     | string   | Placeholder text when editor is empty (default: 'Write something...') |
| className       | string   | Additional CSS class                                                  |
| allowSourceView | boolean  | Whether to allow switching to source view (default: true)             |
| singleLineMode  | boolean  | Whether to restrict editor to a single line (default: false)          |

### MarkdownRenderer Props

| Prop      | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| content   | string | The markdown content to render |
| className | string | Additional CSS class           |

## License

MIT
