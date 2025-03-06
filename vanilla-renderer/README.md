# @mfyz/markdown-renderer-with-custom-directives

A zero-dependency markdown renderer with support for custom directives. This package is part of the [@mfyz/markdown-editor-with-custom-directives](https://github.com/mfyz/markdown-editor-with-custom-directives) project.

## Features

- Zero dependencies
- Support for basic markdown syntax (bold, italic, strikethrough, links)
- Custom directives:
  - Color directive (`:color[text]{#color}`)
  - Button directive (`:button[text]{url=URL shape=SHAPE color=COLOR}`)
- Multiple distribution formats (ESM, CommonJS, IIFE)
- Tiny bundle size
- Browser and Node.js support

## Installation

```bash
npm install @mfyz/markdown-renderer-with-custom-directives
```

## Usage

### ES Modules

```javascript
// Option 1: Named imports
import { renderESM } from '@mfyz/markdown-renderer-with-custom-directives'

const markdown =
  '**Bold** and :color[colored]{#ff0000} with :button[Click me]{url=https://example.com shape=pill color=blue}'
const html = renderESM(markdown)

// Option 2: Default import
import MarkdownRenderer from '@mfyz/markdown-renderer-with-custom-directives'

const html = MarkdownRenderer.render(markdown)
```

### CommonJS

```javascript
// Option 1: Destructuring
const { render } = require('@mfyz/markdown-renderer-with-custom-directives')

const markdown =
  '**Bold** and :color[colored]{#ff0000} with :button[Click me]{url=https://example.com shape=pill color=blue}'
const html = render(markdown)

// Option 2: Using the class
const { MarkdownRenderer } = require('@mfyz/markdown-renderer-with-custom-directives')

const html = MarkdownRenderer.render(markdown)
```

### Browser

```html
<script src="https://unpkg.com/@mfyz/markdown-renderer-with-custom-directives/dist/index.browser.js"></script>
<script>
  const markdown =
    '**Bold** and :color[colored]{#ff0000} with :button[Click me]{url=https://example.com shape=pill color=blue}'
  const html = MarkdownRenderer.render(markdown)
  document.getElementById('content').innerHTML = html
</script>
```

## Custom Directives

### Color Directive

The color directive allows you to add colored text:

```markdown
:color[This text will be red]{#ff0000}
```

### Button Directive

The button directive creates styled buttons with various presets:

```markdown
:button[Click me]{url=https://example.com shape=pill color=blue}
```

Available button styles:

- Shapes: `pill`, `rounded`, `rect`
- Colors: `blue`, `purple`, `green`, `red`, `yellow`, `gray`

Example variations:

```markdown
:button[Primary]{url=https://example.com shape=pill color=blue}
:button[Success]{url=https://example.com shape=rect color=green}
:button[Warning]{url=https://example.com shape=rounded color=yellow}
```

## API Reference

### render(markdown: string): string

Renders markdown text with custom directives into HTML.

Parameters:

- `markdown`: The markdown text to render

Returns:

- HTML string with rendered markdown and custom directives

## Troubleshooting

### Import Issues in Next.js or other ESM environments

If you encounter an error like:

```
Error: Module not found: ESM packages (@mfyz/markdown-renderer-with-custom-directives) need to be imported. Use 'import' to reference the package instead.
```

Make sure to use ES Module import syntax:

```javascript
import { renderESM } from '@mfyz/markdown-renderer-with-custom-directives'
```

### Import Issues in CommonJS environments

If you're working in a CommonJS environment (like a Node.js script), use require:

```javascript
const { render } = require('@mfyz/markdown-renderer-with-custom-directives')
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build distribution files
npm run build
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](../CONTRIBUTING.md) for details.

## License

MIT License - see the [LICENSE](../LICENSE) file for details.
