# Contributing Guide

Thank you for your interest in contributing to the `@mfz/markdown-editor-with-custom-directives` package! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/mfyz/markdown-editor-with-custom-directives.git
   cd markdown-editor-with-custom-directives
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style

We use Prettier for code formatting. Run the following command before committing:

```bash
npm run format
```

### Testing

All new features and bug fixes should include tests. Run tests with:

```bash
npm test
```

### Commit Messages

Please use clear and descriptive commit messages. We recommend following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new button shape option
fix: correct color directive regex
docs: update README with new examples
```

## Pull Request Process

1. Create a new branch for your feature or bug fix
2. Make your changes
3. Run tests and ensure they pass
4. Update documentation if necessary
5. Submit a pull request to the `main` branch
6. Describe your changes in the pull request description

## Feature Requests and Bug Reports

If you have a feature request or found a bug, please open an issue on GitHub. Please include:

- A clear and descriptive title
- A detailed description of the feature or bug
- Steps to reproduce (for bugs)
- Expected behavior
- Screenshots (if applicable)

## Project Structure

```
markdown-editor-with-custom-directives/
├── src/                  # Source code
│   ├── components/       # React components
│   ├── extensions/       # Custom directives
│   └── index.ts          # Main exports
├── dist/                 # Build output (generated)
├── tests/                # Test files
├── README.md             # Documentation
├── CONTRIBUTING.md       # This file
├── PUBLISHING.md         # Publishing guide
└── LICENSE               # MIT license
```

## Custom Directives

When working with custom directives, ensure they follow the established patterns:

- Color directive: `:color[text]{#hexcolor}`
- Button directive: `:button[text]{url="..." shape="..." color="..."}`

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License.
