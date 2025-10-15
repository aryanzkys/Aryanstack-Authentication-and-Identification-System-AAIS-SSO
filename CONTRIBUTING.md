# Contributing to AAIS SSO

Thank you for your interest in contributing to the Aryanstack Authentication and Identification System (AAIS) SSO! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Aryanstack-Authentication-and-Identification-System-AAIS-SSO.git
   cd Aryanstack-Authentication-and-Identification-System-AAIS-SSO
   ```

3. **Set up the development environment** (see [Development Guide](docs/development-guide.md))

4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How to Contribute

### Types of Contributions

- **Bug Fixes**: Fix bugs in the code
- **Features**: Add new features or enhance existing ones
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve tests
- **Performance**: Optimize code performance
- **Refactoring**: Improve code structure without changing functionality

## Development Process

### 1. Set Up Your Environment

Follow the [Development Guide](docs/development-guide.md) to set up:
- Node.js and npm
- Supabase database
- Ory Hydra (Docker)
- Environment variables

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

- Test manually with Postman or curl
- Ensure existing functionality still works
- Test edge cases

### 4. Document Your Changes

- Update README if needed
- Add JSDoc comments to functions
- Update API documentation if adding/changing endpoints
- Add examples if applicable

## Coding Standards

### JavaScript Style

- **Use ES6+ features**: const, let, arrow functions, async/await
- **No var**: Use const or let
- **Semicolons**: Required at end of statements
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Naming conventions**:
  - camelCase for variables and functions
  - PascalCase for classes
  - UPPER_CASE for constants

### Example

```javascript
/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} User object
 */
const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw error;
  }
};
```

### File Organization

- **One responsibility per file**
- **Group related functionality**
- **Use clear, descriptive names**
- **Keep files under 300 lines** when possible

### Error Handling

- **Always use try/catch** in async functions
- **Pass errors to next()** in Express middleware
- **Log errors** with appropriate level
- **Return meaningful error messages** to users

```javascript
const myController = async (req, res, next) => {
  try {
    // Your code
    res.json({ success: true });
  } catch (error) {
    logger.error('Controller error:', error);
    next(error);
  }
};
```

## Commit Guidelines

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat: Add password reset endpoint

Implements password reset functionality with email verification.
Users can request a reset link via email.

Closes #123
```

```
fix: Resolve token expiration issue

Fixed bug where tokens were expiring immediately due to
incorrect time calculation.
```

```
docs: Update API documentation

Added examples for all endpoints and improved error response
documentation.
```

### Commit Message Rules

- **Use imperative mood**: "Add feature" not "Added feature"
- **First line under 72 characters**
- **Provide context in body** if needed
- **Reference issues/PRs** in footer

## Pull Request Process

### Before Creating a PR

1. **Update your branch** with latest main:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run tests** and ensure everything works

3. **Review your changes**:
   ```bash
   git diff main...your-branch
   ```

### Creating a PR

1. **Push your branch**:
   ```bash
   git push origin your-branch
   ```

2. **Create Pull Request** on GitHub

3. **Fill out the PR template**:
   - Clear title describing the change
   - Description of what changed and why
   - Reference any related issues
   - Screenshots if UI changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How you tested the changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Manual testing completed
```

### Review Process

- PRs require review before merging
- Address all review comments
- Update PR based on feedback
- Keep discussion respectful and constructive

## Reporting Bugs

### Before Reporting

1. **Check existing issues** to avoid duplicates
2. **Verify it's a bug** not expected behavior
3. **Test with latest version**

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Ubuntu 22.04]
- Node.js version: [e.g., 18.0.0]
- npm version: [e.g., 8.0.0]

## Screenshots
If applicable

## Additional Context
Any other relevant information
```

## Suggesting Features

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How you envision this working

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Any other relevant information
```

## Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email security concerns privately
2. Include detailed description
3. Wait for response before disclosure

## Questions?

- Check [Documentation](docs/)
- Search existing issues
- Ask in discussions
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Project documentation

Thank you for contributing to AAIS SSO! 🎉
