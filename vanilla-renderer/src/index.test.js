import { render } from './index.js'

console.log('Running tests...\n')

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.error(`❌ ${message}`)
    console.error('Expected:', expected)
    console.error('Actual:', actual)
    throw new Error('Test failed')
  }
  console.log(`✅ ${message}`)
}

// Test headlines
assertEqual(render('# Heading 1'), '<h1>Heading 1</h1>', 'H1 renders correctly')

assertEqual(
  render('## Heading 2'),
  '<h2>Heading 2</h2>',
  'H2 renders correctly'
)

assertEqual(
  render('### Heading 3'),
  '<h3>Heading 3</h3>',
  'H3 renders correctly'
)

// Test unordered lists
assertEqual(
  render('- Item 1\n- Item 2\n- Item 3'),
  '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
  'Unordered list renders correctly'
)

assertEqual(
  render('* Item 1\n* Item 2\n* Item 3'),
  '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
  'Unordered list with asterisks renders correctly'
)

// Test line breaks
assertEqual(
  render('Line 1\nLine 2\nLine 3'),
  'Line 1<br>Line 2<br>Line 3',
  'Line breaks render correctly'
)

// Test headlines with different line break patterns
assertEqual(
  render('# Heading 1\nNext line'),
  '<h1>Heading 1</h1>Next line',
  'H1 with single line break renders without br'
)

assertEqual(
  render('# Heading 1\n\nNext line'),
  '<h1>Heading 1</h1>Next line',
  'H1 with double line break renders without br'
)

assertEqual(
  render('# Heading 1\n\n\nNext line'),
  '<h1>Heading 1</h1><br>Next line',
  'H1 with triple line break preserves one br'
)

// Test mixed content
assertEqual(
  render('# Title\n\n- Item 1\n- Item 2\n\nParagraph with **bold** text'),
  '<h1>Title</h1><ul><li>Item 1</li><li>Item 2</li></ul><br><br>Paragraph with <strong>bold</strong> text',
  'Mixed content renders correctly'
)

// Test basic markdown
assertEqual(
  render('**Bold text**'),
  '<strong>Bold text</strong>',
  'Bold text renders correctly'
)

assertEqual(
  render('*Italic text*'),
  '<em>Italic text</em>',
  'Italic text renders correctly'
)

assertEqual(
  render('~~Strikethrough text~~'),
  '<del>Strikethrough text</del>',
  'Strikethrough text renders correctly'
)

assertEqual(
  render('[Link text](https://example.com)'),
  '<a href="https://example.com">Link text</a>',
  'Link renders correctly'
)

// Test custom directives
assertEqual(
  render(':color[Colored text]{#ff0000}'),
  '<span style="color:#ff0000">Colored text</span>',
  'Color directive renders correctly'
)

// Test color directive with markdown formatting inside
assertEqual(
  render(':color[Text with *italic* formatting]{#ff0000}'),
  '<span style="color:#ff0000">Text with <em>italic</em> formatting</span>',
  'Color directive with italic text renders correctly'
)

// Test color directive with bold formatting inside
assertEqual(
  render(':color[Text with **bold** formatting]{#ff0000}'),
  '<span style="color:#ff0000">Text with <strong>bold</strong> formatting</span>',
  'Color directive with bold text renders correctly'
)

// Test button directive with markdown formatting inside
assertEqual(
  render(
    ':button[Click with *italic* text]{url=https://example.com shape=rounded color=blue}'
  ),
  '<a href="https://example.com" style="display: inline-block; text-decoration: none; padding: 2px 10px; cursor: pointer; color: white; border-radius: 5px; background-color: #3b82f6">Click with <em>italic</em> text</a>',
  'Button directive with italic text renders correctly'
)

assertEqual(
  render(':button[Click me]{url=https://example.com shape=rounded color=blue}'),
  '<a href="https://example.com" style="display: inline-block; text-decoration: none; padding: 2px 10px; cursor: pointer; color: white; border-radius: 5px; background-color: #3b82f6">Click me</a>',
  'Button directive renders correctly with default style'
)

assertEqual(
  render(':button[Click me]{url=https://example.com shape=pill color=purple}'),
  '<a href="https://example.com" style="display: inline-block; text-decoration: none; padding: 2px 10px; cursor: pointer; color: white; border-radius: 9999px; background-color: #8a63d2">Click me</a>',
  'Button directive renders correctly with custom style'
)

// Test button directive with bold formatting inside
assertEqual(
  render(
    ':button[Text with **bold** formatting]{url=https://example.com shape=rounded color=blue}'
  ),
  '<a href="https://example.com" style="display: inline-block; text-decoration: none; padding: 2px 10px; cursor: pointer; color: white; border-radius: 5px; background-color: #3b82f6">Text with <strong>bold</strong> formatting</a>',
  'Button directive with bold text renders correctly'
)

// Test button directive with strikethrough formatting inside
assertEqual(
  render(
    ':button[Text with ~~strikethrough~~ formatting]{url=https://example.com shape=rounded color=blue}'
  ),
  '<a href="https://example.com" style="display: inline-block; text-decoration: none; padding: 2px 10px; cursor: pointer; color: white; border-radius: 5px; background-color: #3b82f6">Text with <del>strikethrough</del> formatting</a>',
  'Button directive with strikethrough text renders correctly'
)

// Test button directive with mixed formatting inside
assertEqual(
  render(
    ':button[Text with **bold**, *italic* and ~~strikethrough~~]{url=https://example.com shape=rounded color=blue}'
  ),
  '<a href="https://example.com" style="display: inline-block; text-decoration: none; padding: 2px 10px; cursor: pointer; color: white; border-radius: 5px; background-color: #3b82f6">Text with <strong>bold</strong>, <em>italic</em> and <del>strikethrough</del></a>',
  'Button directive with mixed formatting renders correctly'
)

// Test combined markdown and directives
assertEqual(
  render(
    '**Bold** and :color[colored]{#ff0000} with :button[Click]{url=https://example.com shape=pill color=blue}'
  ),
  '<strong>Bold</strong> and <span style="color:#ff0000">colored</span> with <a href="https://example.com" style="display: inline-block; text-decoration: none; padding: 2px 10px; cursor: pointer; color: white; border-radius: 9999px; background-color: #3b82f6">Click</a>',
  'Combined markdown and directives render correctly'
)

// Test complex nested formatting in directives
assertEqual(
  render(
    'Regular text with :color[colored *italic* and **bold** text]{#00aa00} and :button[a **bold** button]{url=https://example.com shape=rounded color=blue}'
  ),
  'Regular text with <span style="color:#00aa00">colored <em>italic</em> and <strong>bold</strong> text</span> and <a href="https://example.com" style="display: inline-block; text-decoration: none; padding: 2px 10px; cursor: pointer; color: white; border-radius: 5px; background-color: #3b82f6">a <strong>bold</strong> button</a>',
  'Complex nested formatting in directives renders correctly'
)

console.log('\nAll tests passed! ✨')
