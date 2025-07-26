# Grep MCP Server

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

```bash
# Clone or download the project
cd grep-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Make globally available (optional)
npm link
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
grep-mcp/
├── src/
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript output
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## MCP Integration

This server implements the Model Context Protocol and can be used with any MCP-compatible client.

### Server Configuration
Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "grep-mcp": {
      "command": "grep-mcp",
      "args": []
    }
  }
}
```

## Security Notes

- Uses `spawn` with `shell: false` to prevent command injection
- Validates all file paths before execution
- Blocks potentially dangerous grep flags in advanced mode
- Input validation with Zod schemas
- No access to system files outside specified targets

