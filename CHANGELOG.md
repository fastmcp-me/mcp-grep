# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-26

### Added
- Initial release of mcp-grep server
- Natural language search intent tool (`grep_search_intent`)
- Direct regex pattern search tool (`grep_regex`)
- Match counting tool (`grep_count`)
- File listing tool (`grep_files_with_matches`)
- Advanced grep tool with custom arguments (`grep_advanced`)
- Built-in patterns for common searches (emails, URLs, phone numbers, etc.)
- Security-first design with input validation
- Comprehensive documentation and examples
- TypeScript support with full type safety
- MCP (Model Context Protocol) compliance

### Security
- Uses `spawn` with `shell: false` to prevent command injection
- Input validation with Zod schemas
- Path validation and sanitization
- Blocked dangerous flags in advanced mode

### Documentation
- Complete README with usage examples
- API documentation for all tools
- Security notes and best practices
- Development setup instructions
