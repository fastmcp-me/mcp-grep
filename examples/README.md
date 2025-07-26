# Example MCP Configuration for Claude Desktop

To use the mcp-grep server with Claude Desktop, add this configuration to your Claude Desktop settings:

## Location
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

## Configuration

```json
{
  "mcpServers": {
    "mcp-grep": {
      "command": "npx",
      "args": ["@247arjun/mcp-grep"],
      "description": "MCP Grep Server - Provides powerful text search capabilities"
    }
  }
}
```

## Alternative: Using Node.js directly

If you have the project built locally:

```json
{
  "mcpServers": {
    "mcp-grep": {
      "command": "node",
      "args": ["/path/to/mcp-grep/build/index.js"],
      "description": "MCP Grep Server - Local installation"
    }
  }
}
```

## Alternative: Global Installation

After running `npm install -g @247arjun/mcp-grep`:

```json
{
  "mcpServers": {
    "mcp-grep": {
      "command": "mcp-grep",
      "args": [],
      "description": "MCP Grep Server - Global installation"
    }
  }
}
```

## Verification

After adding the configuration:
1. Restart Claude Desktop
2. Start a new conversation
3. Ask Claude to search for something in your files using natural language
4. The mcp-grep tools should be available for text searching

## Example Usage

Once configured, you can ask Claude things like:
- "Find all email addresses in the src directory"
- "Search for TODO comments in JavaScript files"
- "Count how many times 'function' appears in my code"
- "List files that contain import statements"
