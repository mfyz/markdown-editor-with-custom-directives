# WYSIWYG Markdown Editor with Custom Directives - Project Plan

## Project Overview

This project aims to create a React-based WYSIWYG markdown editor component with standard formatting options and custom markdown directives. The editor will support:

- Basic text styling (bold, italic, strikethrough)
- Link functionality with edit/remove options
- Custom markdown directives:
  1. Text colors (`:color[text]{#color}`)
  2. Buttons (`:button[text](url)`)
- Multiple display modes (minimal/single-line, small, and large)
- Responsive toolbar (fixed and floating options)

## Tech Stack

### Core Technologies

- **[React](https://react.dev/)**: For building the component-based UI
- **[TypeScript](https://www.typescriptlang.org/)**: For type safety, better developer experience, and improved code quality
- **[CSS Modules](https://github.com/css-modules/css-modules)** or **[Styled Components](https://styled-components.com/)**: For component styling

### Markdown Editor Base

After evaluating several options, we'll use one of these established markdown editors as our foundation:

- **[Slate.js](https://docs.slatejs.org/)**: Highly customizable framework for building rich text editors
- **[TipTap](https://tiptap.dev/)**: Based on ProseMirror, offers a good balance of customization and ready-made features
- **[MDX Editor](https://mdxeditor.dev/)**: Built on Lexical, provides good markdown support with extensibility
- **[React-Markdown-Editor-Lite](https://github.com/HarryChen0506/react-markdown-editor-lite)**: Simpler option with good extensibility

### Supporting Libraries

- **[React Color](https://github.com/casesandberg/react-color)**: For the color picker component
- **[React-Popper](https://popper.js.org/react-popper/)** or **[React-Popover](https://github.com/popperjs/react-popper)**: For floating toolbars and popovers
- **[React Icons](https://react-icons.github.io/react-icons/)**: For toolbar icons

### Development Tools

- **[Vite](https://vitejs.dev/)**: For fast development and building
- **[Prettier](https://prettier.io/)**: For consistent code formatting
- **[Husky](https://typicode.github.io/husky/)** & **[lint-staged](https://github.com/okonet/lint-staged)**: For pre-commit hooks to ensure code quality
- **[Jest](https://jestjs.io/)**: For unit testing
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)**: For component testing
- **[Playwright](https://playwright.dev/)**: For end-to-end testing

## Development Approach

We'll follow an iterative development approach with clearly defined checkpoints. Each checkpoint will include:

1. Implementation of specific features
2. Writing tests for implemented functionality
3. Running all tests to ensure no regressions
4. Manual testing
5. Review with the project owner
6. Git commit of approved changes

This approach allows us to:

- Get early feedback
- Make course corrections as needed
- Maintain a clean, working codebase at each checkpoint
- Ensure previously implemented functionality continues to work
- Revert to previous checkpoints if needed

## Development Principles

To maintain code quality and project stability, we will adhere to the following strict principles:

### Strict Code Change Discipline

- **Focused Changes Only**: Only modify code directly related to the feature or fix being implemented
- **No Refactoring Unrelated Code**: Avoid changing code in unrelated areas, even if improvements seem obvious
- **Minimal Changes**: Make the smallest possible changes to achieve the required functionality
- **Isolated Components**: Design components to be isolated and independent to minimize cross-component impacts
- **Document Any Exceptions**: If changes to unrelated code are absolutely necessary, document the rationale thoroughly

### Tests as Sacred Artifacts

- **Test Immutability**: Treat previously written tests as sacred and unchangeable
- **Test-First Approach**: Write tests before implementing new features
- **Test Preservation**: Only modify existing tests when the underlying feature implementation changes
- **Test Coverage Maintenance**: Never reduce test coverage; only add to it
- **Test Failure Investigation**: If a previously passing test fails, investigate the root cause thoroughly before modifying the test

These principles will help us maintain a stable codebase, ensure that previously implemented functionality continues to work as expected, and provide a solid foundation for future development.

## Development Workflow

### Running the Development Server

When working on the project, follow these guidelines for the development server:

1. **Start the server with npm**: Use `npm run dev` to start the development server. The script has been modified to check if a Vite server is already running on common ports (5173, 5174, 5175) before starting a new one.

2. **Automatic port detection**: If a Vite server is already running, the script will display a message instead of starting a new instance.

3. **Hot Module Replacement**: Vite includes hot module replacement (HMR) which automatically refreshes the browser when files change, so there's no need to restart the server during development.

4. **Stopping the server**: If you need to stop the server, use `Ctrl+C` in the terminal where it's running.

### Development Best Practices

## VSCode Configuration

We'll set up VSCode with the following settings:

- Prettier extension for automatic formatting
- Format on save enabled for Prettier
- Recommended extensions for React and TypeScript development

This will help maintain code quality throughout the development process and make it easier to maintain consistent code style.

### Important Note on Code Formatting

This project uses Prettier for code formatting. We explicitly avoid using ESLint to prevent conflicts and to maintain a single source of truth for code style.

## Git Hooks Configuration

To ensure code quality and consistency throughout the development process, we'll implement Git hooks using:

- **Husky**: For managing Git hooks
- **lint-staged**: For running linters on staged Git files

The initial configuration will include:

- Pre-commit hook to run linting checks on staged files
- Pre-commit hook to run tests affected by the changes
- Pre-commit check to verify that only relevant files are being modified
- Prevent commits if linting fails or tests fail
- Only lint files that are being committed

This setup will ensure that all committed code meets our quality standards and adheres to our development principles. As the project progresses, we can extend the hooks to include:

- Type checking
- Unit tests for all affected components
- Test coverage verification
- Enforcement of focused changes
- Custom validation rules

## Testing Strategy

To ensure the reliability and quality of our WYSIWYG markdown editor, we'll implement a comprehensive testing strategy using multiple testing layers:

### Test-Driven Development Approach

For critical functionality, especially custom directives, we'll follow a test-driven development (TDD) approach:

1. Write tests that define the expected behavior
2. Implement the functionality to pass the tests
3. Refactor while ensuring tests continue to pass

### Unit Testing with Jest

- Test individual functions and utilities
- Test custom markdown directive parsers
- Ensure core logic works correctly in isolation
- Focus on edge cases and error handling

### Component Testing with React Testing Library

- Test React components in isolation
- Verify component rendering and user interactions
- Test toolbar functionality and editor modes
- Ensure accessibility standards are met

### Integration Testing

- Test interactions between components
- Verify custom directives work end-to-end
- Test editor state management across interactions
- Ensure proper markdown generation and parsing

### End-to-End Testing with Playwright

- Test the complete user flow
- Verify the editor works in different browsers
- Test real-world scenarios with actual user interactions
- Validate the final output matches expectations

### Test Preservation and Evolution

- Once written and passing, tests become immutable unless the feature changes
- Tests serve as documentation of expected behavior
- Tests act as a safety net for future changes
- When a feature implementation changes, update its tests in a dedicated commit

### Testing at Each Checkpoint

Before each checkpoint review:

1. Write tests for newly implemented features
2. Run the full test suite to catch regressions
3. Fix any issues before proceeding to manual testing
4. Never modify existing tests to make them pass without understanding why they failed

This multi-layered testing approach will help us maintain a high-quality codebase and ensure that previously implemented functionality continues to work as expected throughout the development process.

## Iterations and Checkpoints

### Iteration 1: Project Setup and Basic Editor

✅ **Checkpoint 1.1: Project Initialization**

- Set up React project with TypeScript and Vite
- Install necessary dependencies
- Create basic project structure
- Set up Prettier for code formatting
- Configure VSCode for auto-formatting on typing/saving
- Set up Husky pre-commit hooks for linting
- Configure Jest and React Testing Library for testing
- Set up Playwright for end-to-end testing
- Create initial test structure and helpers

✅ **Checkpoint 1.2: Basic Editor Implementation**

- Implement basic markdown editor component
- Set up basic styling
- Ensure the editor can render and edit markdown

### Iteration 2: Testing Infrastructure

✅ **Checkpoint 2.1: Unit Testing Setup**

- Set up Jest configuration for unit tests
- Create test utilities and helpers
- Implement initial unit tests for core functionality
- Set up test coverage reporting

✅ **Checkpoint 2.2: Component and E2E Testing Setup**

- Set up React Testing Library for component tests
- Configure Playwright for end-to-end tests
- Create test fixtures and mocks
- Implement initial component tests for the basic editor

### Iteration 3: Standard Formatting Features

✅ **Checkpoint 3.1: Text Styling**

- Implement bold, italic, strikethrough functionality
- Create toolbar with styling buttons
- Ensure proper markdown generation
- Write comprehensive tests for styling features

✅ **Checkpoint 3.2: Link Functionality**

- Implement link creation
- Add link editing popover
- Support for opening links, editing link text and URL, and removing links
- Write comprehensive tests for link functionality

### Iteration 4: Editor Modes and Toolbar Options

✅ **Checkpoint 4.1: Editor Size Variant: SingleLineMode**

- Update app.tsx to have multiple examples. Start with: single-line editor mode. This mode also should add a new prop singleLineMode which would disable new line inside the editor. This mode also will hide the toggle.

✅ **Checkpoint 4.2: Toolbar Variants**

- Implement fixed toolbar option
- Create floating toolbar that appears on focus
- Ensure responsive behavior across different editor sizes
- Write tests for toolbar behavior in different modes

### Iteration 5: Integration and Demo Page

⏩ **Checkpoint 5.1: Component API Finalization**

- Finalize component props and API
- Document usage patterns
- Ensure consistent behavior across different configurations
- Write tests for the component API

✅ **Checkpoint 5.2: Demo Page**

- Create demo page with three editor instances (minimal, small, large)
- Add controls to showcase different features
- Ensure all features work correctly in the demo
- Write end-to-end tests for the demo page

### Iteration 6: Custom Directives

**Checkpoint 6.1: Text Color Directive**

- Implement `:color[text]{#color}` directive parsing and rendering
- Create color picker component
- Ensure proper visualization of colored text in the editor
- Write comprehensive tests for the color directive

**Checkpoint 6.2: Button Directive**

- Implement `:button[text](url)` directive parsing and rendering
- Create button styling
- Ensure proper visualization of buttons in the editor
- Write comprehensive tests for the button directive

## Review Process

At each checkpoint:

1. The implementation will be presented for review
2. You will test the functionality and provide feedback
3. Any necessary adjustments will be made
4. Once approved, changes will be committed to git
5. Development will proceed to the next checkpoint

If at any point we need to revert to a previous checkpoint, we can use git to restore the codebase to that state and proceed from there.

## Timeline Estimate

For detailed human developer time estimates, please refer to [estimates.md](./estimates.md).

Total estimated time: 11-17 days

## Next Steps

Upon approval of this plan, we will begin with Iteration 1, setting up the project structure and implementing the basic editor functionality.
