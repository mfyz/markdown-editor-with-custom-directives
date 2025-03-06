const esbuild = require('esbuild')
const path = require('path')

// Common build options
const commonOptions = {
  entryPoints: [path.join(__dirname, 'src/index.js')],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2015'],
  platform: 'neutral'
}

// Build all formats
function build() {
  try {
    // Build ESM version
    esbuild
      .build({
        ...commonOptions,
        entryPoints: [path.join(__dirname, 'src/index.esm.js')],
        format: 'esm',
        outfile: path.join(__dirname, 'dist/index.esm.mjs')
      })
      .then(() => {
        console.log('ESM build completed')

        // Build CommonJS version
        return esbuild.build({
          ...commonOptions,
          format: 'cjs',
          outfile: path.join(__dirname, 'dist/index.cjs.js')
        })
      })
      .then(() => {
        console.log('CommonJS build completed')

        // Build browser version (IIFE)
        return esbuild.build({
          ...commonOptions,
          format: 'iife',
          globalName: 'MarkdownRenderer',
          outfile: path.join(__dirname, 'dist/index.browser.js')
        })
      })
      .then(() => {
        console.log('Browser build completed')
        console.log('All builds completed successfully!')
      })
      .catch(error => {
        console.error('Build failed:', error)
        process.exit(1)
      })
  } catch (error) {
    console.error('Build setup failed:', error)
    process.exit(1)
  }
}

build()
