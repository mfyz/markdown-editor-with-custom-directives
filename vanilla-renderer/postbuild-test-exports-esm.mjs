// ESM test script
import { render } from './dist/index.esm.mjs'

import { assertEqual } from './test-utils.js'

const markdown =
  '**Bold** and :color[colored]{#ff0000} with :button[Click me]{url=https://example.com shape=pill color=blue}'

// Test headlines
assertEqual(
  render(markdown),
  '<strong>Bold</strong> and <span style="color:#ff0000">colored</span> with <a href="https://example.com" style="display: inline-block; text-decoration: none; padding: 2px 10px; cursor: pointer; color: white; border-radius: 9999px; background-color: #3b82f6">Click me</a>',
  'Markdown export renders correctly using esmodule exports'
)
