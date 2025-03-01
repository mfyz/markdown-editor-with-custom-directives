# Markdown Editor with Custom Directives

A React markdown editor with custom directives for colored text and styled buttons.

## Features

- Full-featured markdown editor with preview
- Custom directives for colored text and styled buttons
- Dual-pane layout with live preview
- Toolbar with formatting options
- Responsive design

## Installation

```bash
npm install @mfyz/markdown-editor-with-custom-directives
```

## Usage

### Editor Component

```jsx
import { MarkdownEditor } from '@mfyz/markdown-editor-with-custom-directives'
import '@mfyz/markdown-editor-with-custom-directives/dist/styles/index.css'

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
import { MarkdownRenderer } from '@mfyz/markdown-editor-with-custom-directives'
import '@mfyz/markdown-editor-with-custom-directives/dist/styles/index.css'

function MarkdownDisplay({ content }) {
  return (
    <div className="markdown-display">
      <MarkdownRenderer content={content} />
    </div>
  )
}
```

### Using with Vite

If you're using Vite and encounter resolution issues, add the following to your `vite.config.js`:

```js
export default defineConfig({
  // ... other config
  resolve: {
    alias: {
      '@mfyz/markdown-editor-with-custom-directives':
        '@mfyz/markdown-editor-with-custom-directives/dist/index.js'
    }
  }
})
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

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/mfyz/markdown-editor-with-custom-directives.git
cd markdown-editor-with-custom-directives

# Install dependencies
npm install

# Start development server
npm run dev
```

### Testing

```bash
# Run tests
npm test

# Check code formatting
npx prettier --check "src/**/*.{js,jsx,ts,tsx}"
```

### CI/CD

This project uses GitHub Actions for continuous integration:

- **Test Workflow**: Runs on every commit to all branches to ensure tests pass

The workflows help maintain code quality and catch issues early in the development process.
