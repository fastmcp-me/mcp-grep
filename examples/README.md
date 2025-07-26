# Example MCP Configuration for Claude Desktop

To use the grep-mcp server with Claude Desktop, add this configuration to your Claude Desktop settings:

## Location
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

## Configuration

```json
{
  "mcpServers": {
    "grep-mcp": {
      "command": "npx",
      "args": ["grep-mcp"],
      "description": "Grep MCP Server - Provides powerful text search capabilities"
    }
  }
}
```

## Alternative: Using Node.js directly

If you have the project built locally:

```json
{
  "mcpServers": {
    "grep-mcp": {
      "command": "node",
      "args": ["/path/to/mcp-grep/build/index.js"],
      "description": "Grep MCP Server - Local installation"
    }
  }
}
```

## Alternative: Global Installation

After running `npm install -g grep-mcp`:

```json
{
  "mcpServers": {
    "grep-mcp": {
      "command": "grep-mcp",
      "args": [],
      "description": "Grep MCP Server - Global installation"
    }
  }
}
```

## Verification

After adding the configuration:
1. Restart Claude Desktop
2. Start a new conversation
3. Ask Claude to search for something in your files using natural language
4. The grep-mcp tools should be available for text searching

## Example Usage

Once configured, you can ask Claude things like:
- "Find all email addresses in the src directory"
- "Search for TODO comments in JavaScript files"
- "Count how many times 'function' appears in my code"
- "List files that contain import statements"
