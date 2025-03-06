# Publishing Guide for @mfyz/markdown-renderer-with-custom-directives

This document outlines the steps required to publish a new version of the `@mfyz/markdown-renderer-with-custom-directives` package to npm.

## tl;dr Quick Publish

```sh
npm version patch
npm run build && npm test
npm publish --access public
```

## Prerequisites

Before publishing, ensure you have:

1. An npm account with access to the `@mfyz` organization
2. Logged in to npm via the CLI (`npm login`)
3. All tests passing (`npm test`)
4. All changes committed to the repository
5. Built files are up-to-date and working correctly

## Version Management

We follow [Semantic Versioning](https://semver.org/) (SemVer) for this package:

- **MAJOR** version for incompatible API changes (e.g., 1.0.0 to 2.0.0)
- **MINOR** version for added functionality in a backward-compatible manner (e.g., 1.0.0 to 1.1.0)
- **PATCH** version for backward-compatible bug fixes (e.g., 1.0.0 to 1.0.1)

## Publishing Process

### 1. Update Version

Update the version in `package.json` according to SemVer rules:

```bash
# For patch releases (bug fixes)
npm version patch

# For minor releases (new features)
npm version minor

# For major releases (breaking changes)
npm version major
```

This command will:

- Update the version in `package.json`
- Create a git tag for the new version
- Commit the changes

### 2. Build and Test

The pre-commit hooks will automatically run the build and tests, but you should run them manually before publishing:

```bash
# Build the package
npm run build

# Run tests
npm test
```

Verify that the `dist` directory contains:

- CommonJS build (index.cjs.js)
- ES Module build (index.esm.js)
- IIFE build for browsers (index.iife.js)
- Source maps for all formats

### 3. Publish to npm

Publish the package to npm:

```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages (`@mfyz/...`) to be publicly accessible.

### 4. Create a GitHub Release

1. Go to the GitHub repository
2. Navigate to "Releases"
3. Click "Draft a new release"
4. Use the tag created by `npm version` (e.g., `v1.0.1`)
5. Add release notes describing the changes
6. Publish the release

## Release Notes

When writing release notes, include:

1. A summary of the changes
2. New features or directives added
3. Bugs fixed
4. Breaking changes (if any)
5. Bundle size changes (if significant)
6. Contributors to this release

Example:

```markdown
## v1.0.1

### Bug Fixes

- Fixed button directive style handling
- Improved color directive parsing

### Improvements

- Reduced bundle size by 20%
- Added source maps for better debugging

### Contributors

- @username1
- @username2
```

## Troubleshooting

### Package Not Showing Up on npm

It may take a few minutes for the package to appear on the npm registry. If it doesn't appear after 15 minutes:

1. Check if the package was published successfully with `npm view @mfyz/markdown-renderer-with-custom-directives`
2. Verify your npm account has the correct permissions

### Publishing Errors

If you encounter errors during publishing:

1. Ensure you're logged in to npm with the correct account
2. Check if the version in `package.json` is unique (not already published)
3. Verify the package name is available and you have the right to publish to it

## Post-Release Tasks

After publishing:

1. Update the main project's documentation to reflect any changes
2. Test the package in a new project to verify installation and usage
3. Monitor the package on npm for any reported issues
4. Create issues for the next release cycle

## Testing after publihs a new version

On an example codebase, using this package, if a new version is published, npm install might not catch up new version because of local cache. To reset, run `npm cache clean --force` then npm install new version.

## Locally Test.

- On this project

  - [Optional] `npm version`
  - `npm build`
  - `npm pack`
    - This generates a local tgz file with package name and version

- On example code (project that consumes this package)
  - Two ways to install the package:
  - 1. `npm install /Users/fatih/Development/markdown-editor-with-custom-directives/vanilla-renderer/mfyz-markdown-renderer-with-custom-directives-1.0.5.tgz`
  - 2. Or put this in package.json dependencies then `npm install`:
    - `"@mfyz/markdown-renderer-with-custom-directives": "file:../markdown-editor-with-custom-directives/vanilla-renderer/mfyz-markdown-renderer-with-custom-directives-1.0.5.tgz",`
