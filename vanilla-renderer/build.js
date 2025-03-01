import * as esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Common build options
const commonOptions = {
  entryPoints: [join(__dirname, 'src/index.js')],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2015'],
  platform: 'neutral'
}

// Build ESM version
await esbuild
  .build({
    ...commonOptions,
    format: 'esm',
    outfile: join(__dirname, 'dist/index.esm.js')
  })
  .catch(() => process.exit(1))

// Build CommonJS version
await esbuild
  .build({
    ...commonOptions,
    format: 'cjs',
    outfile: join(__dirname, 'dist/index.cjs.js')
  })
  .catch(() => process.exit(1))

// Build browser version (IIFE)
await esbuild
  .build({
    ...commonOptions,
    format: 'iife',
    globalName: 'MarkdownRenderer',
    outfile: join(__dirname, 'dist/index.browser.js')
  })
  .catch(() => process.exit(1))
