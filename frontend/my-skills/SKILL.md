---
name: dev-workflow-assistant
description: Comprehensive guide for code refactoring, code reviews, and deployment preparation.
---

# Development Workflow Assistant

This skill provides a structured approach for three key development tasks: Code Refactoring, Code Review, and Deployment Preparation.

## 1. Code Refactoring

When the user requests a code refactor, adhere to the following process to ensure high-quality, maintainable code:

### Analysis & Planning
*   **Identify Code Smells**: Look for duplication, long functions, deep nesting, and tight coupling.
*   **Strategy**: Decide on the pattern to apply (e.g., Extract Method, Extract Component, Custom Hooks).
*   **State Management**: Evaluate if state is placed correctly (local vs. global).

### Execution Rules
*   **Incremental Changes**: Make small, verifiable changes rather than one massive rewrite.
*   **Type Safety**: Ensure strict TypeScript types are maintained or improved. Avoid `any` types.
*   **Componentization**: Break down large components into smaller, single-responsibility components.
    *   *Props*: Define clear interfaces for component props.
*   **Logic Extraction**: Move complex business logic out of UI components into:
    *   Custom Hooks (for React state/effects).
    *   Utility functions (for pure logic).

### Verification
*   **Behavior Preservation**: The refactor should NOT change the external behavior of the application unless explicitly requested.
*   **Testing**: Run existing tests or add new ones to verify the refactored code.

## 2. Code Review

Use this checklist to perform a thorough code review of user code or your own generated code:

### Functional Correctness
*   Does the code implement the requested feature or fix the bug?
*   Are edge cases and error states handled?

### Code Quality & Style
*   **Readability**: Is the code self-explanatory? Are naming conventions consistent?
*   **DRY Principle**: Is there repeated code that should be abstracted?
*   **Consistency**: Does it follow the project's existing patterns and style guide?

### performance
*   **Render Optimization**: Check for unnecessary re-renders (use `useMemo`, `useCallback` appropriately).
*   **Data Fetching**: Is data fetching efficient? Are loading and error states handled?

### Security & Accessibility
*   **Security**: Check for common vulnerabilities (XSS, input validation).
*   **Accessibility (a11y)**: Are semantic HTML tags used? Are `aria-` attributes correct? Is keyboard navigation supported?

## 3. Deployment Preparation

Before considering a task complete or ready for deployment, perform the following checks:

### Automated Checks
1.  **Linting**: Run `npm run lint` to catch stylistic and potential logic errors.
2.  **Type Checking**: Run `tsc --noEmit` (or the project's type-check script) to ensure no TypeScript errors.
3.  **Build Verification**: Run `npm run build` to guarantee the application builds successfully for production.

### Optimization Checklist
*   **Bundle Size**: Are imports optimized (e.g., tree-shaking)?
*   **Assets**: Are images optimized?
*   **Lazy Loading**: Are routes or heavy components lazy-loaded where appropriate?

### Configuration
*   **Environment Variables**: Ensure all required environment variables are documented and configured.
*   **Clean Up**: Remove `console.log` statements, commented-out code, and unused files.