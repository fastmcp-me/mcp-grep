# Contributing to grep-mcp

Thank you for your interest in contributing to grep-mcp! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/mcp-grep.git
   cd mcp-grep
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build the project**:
   ```bash
   npm run build
   ```

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Build and test**:
   ```bash
   npm run build
   npm test
   ```

4. **Commit your changes**:
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## Coding Standards

- **TypeScript**: Use TypeScript for all source code
- **Code Style**: Follow the existing code style and formatting
- **Error Handling**: Always handle errors appropriately
- **Security**: Never introduce shell injection vulnerabilities
- **Documentation**: Update README.md for new features
- **Validation**: Use Zod schemas for input validation

## Commit Message Convention

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Testing

- Write tests for new features
- Ensure all existing tests pass
- Test with actual MCP clients when possible
- Include edge cases and error scenarios

## Security Considerations

When contributing:

- Never use `shell: true` in child_process.spawn
- Always validate user input with Zod schemas
- Sanitize file paths properly
- Be cautious with regex patterns that could cause ReDoS

## Pull Request Guidelines

Before submitting a PR:

- ✅ Code builds without errors
- ✅ All tests pass
- ✅ Documentation is updated
- ✅ Commit messages follow convention
- ✅ No security vulnerabilities introduced
- ✅ Code follows existing style

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase
- Clarification on contributing guidelines

## License

By contributing to grep-mcp, you agree that your contributions will be licensed under the MIT License.
