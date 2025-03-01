# Publishing Guide

This document outlines the steps required to publish a new version of the `@mfz/markdown-editor-with-custom-directives` package to npm.

## Prerequisites

Before publishing, ensure you have:

1. An npm account with access to the `@mfz` organization
2. Logged in to npm via the CLI (`npm login`)
3. All tests passing (`npm test`)
4. All changes committed to the repository

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

### 2. Build the Package

Build the package to ensure all distribution files are up-to-date:

```bash
npm run build
```

Verify that the `dist` directory contains:

- JavaScript files (ES modules and UMD formats)
- TypeScript declaration files
- CSS files

### 3. Test the Build

Make sure the built package works correctly:

```bash
npm test
```

### 4. Publish to npm

Publish the package to npm:

```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages (`@mfz/...`) to be publicly accessible.

### 5. Create a GitHub Release

1. Go to the GitHub repository
2. Navigate to "Releases"
3. Click "Draft a new release"
4. Use the tag created by `npm version` (e.g., `v1.0.1`)
5. Add release notes describing the changes
6. Publish the release

## Release Notes

When writing release notes, include:

1. A summary of the changes
2. New features added
3. Bugs fixed
4. Breaking changes (if any)
5. Contributors to this release

Example:

```
## v1.0.1

### Bug Fixes
- Fixed color directive rendering in Firefox
- Improved button directive styling on mobile devices

### Contributors
- @username1
- @username2
```

## Troubleshooting

### Package Not Showing Up on npm

It may take a few minutes for the package to appear on the npm registry. If it doesn't appear after 15 minutes:

1. Check if the package was published successfully with `npm view @mfz/markdown-editor-with-custom-directives`
2. Verify your npm account has the correct permissions

### Publishing Errors

If you encounter errors during publishing:

1. Ensure you're logged in to npm with the correct account
2. Check if the version in `package.json` is unique (not already published)
3. Verify the package name is available and you have the right to publish to it

## Post-Release Tasks

After publishing:

1. Update the documentation website (if applicable)
2. Announce the new release in appropriate channels
3. Create issues for the next release cycle
