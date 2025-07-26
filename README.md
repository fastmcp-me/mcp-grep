# MCP Grep Server

[![npm version](https://badge.fury.io/js/@247arjun%2Fmcp-grep.svg)](https://badge.fury.io/js/@247arjun%2Fmcp-grep)
[![npm downloads](https://img.shields.io/npm/dm/@247arjun/mcp-grep.svg)](https://www.npmjs.com/package/@247arjun/mcp-grep)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that provides powerful text search capabilities using the `grep` command-line utility. This server allows you to search for patterns in files and directories using both natural language descriptions and direct regex patterns.

## Features

### 🧠 Natural Language Search
- Describe what you're looking for in plain English
- Automatic conversion to appropriate regex patterns
- Built-in patterns for common searches (emails, URLs, phone numbers, etc.)

### 🔍 Advanced Search Capabilities
- Direct regex pattern matching
- Recursive directory searching
- File extension filtering
- Case-sensitive/insensitive search
- Whole word matching
- Context line display
- Match counting
- File listing with matches

### 🛡️ Security First
- Safe command execution using `child_process.spawn`
- Input validation with Zod schemas
- No shell injection vulnerabilities
- Path validation and sanitization

## Installation

### Method 1: NPM Installation (Recommended)

```bash
# Install globally
npm install -g @247arjun/mcp-grep

# Or install locally in your project
npm install @247arjun/mcp-grep
```

### Method 2: From Source

```bash
# Clone the repository
git clone https://github.com/247arjun/mcp-grep.git
cd mcp-grep

# Install dependencies
npm install

# Build the project
npm run build

# Optional: Link globally
npm link
```

### Method 3: Direct from GitHub

```bash
# Install directly from GitHub
npm install -g git+https://github.com/247arjun/mcp-grep.git
```

## Quick Start

### 1. Configure with Claude Desktop

Add to your Claude Desktop configuration file:

**Location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

**Configuration:**
```json
{
  "mcpServers": {
    "mcp-grep": {
      "command": "mcp-grep",
      "args": []
    }
  }
}
```

### 2. Restart Claude Desktop

After adding the configuration, restart Claude Desktop to load the MCP server.

### 3. Start Using

Ask Claude to search your files:
- "Find all email addresses in my project"
- "Search for TODO comments in JavaScript files"
- "Count function definitions in the src directory"

## Verification

Test that the server is working:

```bash
# Test the built server
node build/index.js

# Should show: "Grep MCP Server running on stdio"
# Press Ctrl+C to exit
```

## Available Tools

### 1. `grep_search_intent`
Search using natural language descriptions.

**Parameters:**
- `intent` (string): Plain English description (e.g., "email addresses", "TODO comments")
- `target` (string): File or directory path to search
- `case_sensitive` (boolean, optional): Case-sensitive search (default: false)
- `max_results` (number, optional): Limit number of results
- `show_context` (boolean, optional): Show surrounding lines (default: false)
- `context_lines` (number, optional): Number of context lines (default: 2)

**Example:**
```javascript
{
  "intent": "email addresses",
  "target": "./src",
  "show_context": true,
  "context_lines": 1
}
```

### 2. `grep_regex`
Search using direct regex patterns.

**Parameters:**
- `pattern` (string): Regular expression pattern
- `target` (string): File or directory path to search
- `case_sensitive` (boolean, optional): Case-sensitive search
- `whole_words` (boolean, optional): Match whole words only
- `invert_match` (boolean, optional): Show non-matching lines
- `max_results` (number, optional): Limit results
- `show_context` (boolean, optional): Show context lines
- `context_lines` (number, optional): Context line count
- `file_extensions` (array, optional): Filter by file extensions

**Example:**
```javascript
{
  "pattern": "function\\s+\\w+\\s*\\(",
  "target": "./src",
  "file_extensions": ["js", "ts"],
  "show_context": true
}
```

### 3. `grep_count`
Count matches for a pattern.

**Parameters:**
- `pattern` (string): Pattern to count
- `target` (string): Search target
- `case_sensitive` (boolean, optional): Case sensitivity
- `whole_words` (boolean, optional): Whole word matching
- `by_file` (boolean, optional): Show count per file
- `file_extensions` (array, optional): File extension filter

### 4. `grep_files_with_matches`
List files containing the pattern.

**Parameters:**
- `pattern` (string): Search pattern
- `target` (string): Directory to search
- `case_sensitive` (boolean, optional): Case sensitivity
- `whole_words` (boolean, optional): Whole word matching
- `file_extensions` (array, optional): File extensions to include
- `exclude_patterns` (array, optional): File patterns to exclude

### 5. `grep_advanced`
Execute grep with custom arguments (advanced users).

**Parameters:**
- `args` (array): Array of grep arguments (excluding 'grep' itself)

## Built-in Natural Language Patterns

The server recognizes these natural language intents:

### Communication
- "email", "email address", "emails" → Email address pattern
- "url", "urls", "website", "link", "links" → URL pattern
- "phone", "phone number", "phone numbers" → Phone number pattern

### Network
- "ip", "ip address", "ip addresses" → IPv4 address pattern

### Data Types
- "number", "numbers", "integer", "integers" → Numeric patterns
- "date", "dates" → Date patterns

### Code Patterns
- "function", "functions" → Function declarations
- "class", "classes" → Class definitions
- "import", "imports" → Import statements
- "export", "exports" → Export statements
- "comment", "comments" → Comment lines
- "todo", "todos" → TODO/FIXME/HACK comments

### Error Patterns
- "error", "errors" → Error messages
- "warning", "warnings" → Warning messages

## Usage Examples

### Search for email addresses in a project
```javascript
{
  "tool": "grep_search_intent",
  "intent": "email addresses",
  "target": "./src",
  "show_context": true
}
```

### Find all TODO comments
```javascript
{
  "tool": "grep_search_intent", 
  "intent": "todo comments",
  "target": "./",
  "file_extensions": ["js", "ts", "py"]
}
```

### Search for function definitions with regex
```javascript
{
  "tool": "grep_regex",
  "pattern": "^\\s*function\\s+\\w+",
  "target": "./src",
  "file_extensions": ["js"]
}
```

### Count occurrences of a word
```javascript
{
  "tool": "grep_count",
  "pattern": "async",
  "target": "./src",
  "by_file": true
}
```

### List files containing import statements
```javascript
{
  "tool": "grep_files_with_matches",
  "pattern": "^import",
  "target": "./src",
  "file_extensions": ["js", "ts"]
}
```

## Development

### Build and Run
```bash
# Development with auto-rebuild
npm run dev

# Production build
npm run build

# Start the server
npm start
```

### Project Structure
```
mcp-grep/
├── src/
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript output
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## MCP Integration

This server implements the Model Context Protocol and can be used with any MCP-compatible client.

### Supported MCP Clients

- **Claude Desktop** (recommended)
- **Cline VS Code Extension**
- **Continue.dev**
- Any other MCP-compatible client

### Server Configuration Examples

#### Claude Desktop
```json
{
  "mcpServers": {
    "mcp-grep": {
      "command": "mcp-grep",
      "args": [],
      "description": "Advanced text search capabilities"
    }
  }
}
```

#### Alternative: Using npx (no global install needed)
```json
{
  "mcpServers": {
    "mcp-grep": {
      "command": "npx",
      "args": ["@247arjun/mcp-grep"],
      "description": "Advanced text search capabilities"
    }
  }
}
```

#### Local Development Setup
```json
{
  "mcpServers": {
    "mcp-grep": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-grep/build/index.js"],
      "description": "Advanced text search capabilities"
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **"Command not found" error**
   - Ensure mcp-grep is installed globally: `npm install -g @247arjun/mcp-grep`
   - Or use npx: `"command": "npx", "args": ["@247arjun/mcp-grep"]`

2. **"Permission denied" error**
   - Check file permissions: `chmod +x build/index.js`
   - Rebuild the project: `npm run build`

3. **MCP server not appearing in Claude**
   - Verify JSON syntax in configuration file
   - Restart Claude Desktop completely
   - Check that the command path is correct

4. **"grep command not found"**
   - Install grep on your system (usually pre-installed on macOS/Linux)
   - Windows users: Install via WSL or use Git Bash

### Debugging

Enable verbose logging by setting environment variable:
```bash
# For development
DEBUG=1 node build/index.js

# Test with sample input
echo '{"jsonrpc": "2.0", "method": "initialize", "params": {}}' | node build/index.js
```

## Security Notes

- Uses `spawn` with `shell: false` to prevent command injection
- Validates all file paths before execution
- Blocks potentially dangerous grep flags in advanced mode
- Input validation with Zod schemas
- No access to system files outside specified targets

