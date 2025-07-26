<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is an MCP (Model Context Protocol) server project that exposes curl functionality to MCP clients.

You can find more info and examples at https://modelcontextprotocol.io/llms-full.txt

## Project Guidelines

- This is a TypeScript project using ES modules
- The MCP server uses stdio transport for communication with clients
- All curl operations should be executed safely using the child_process.spawn method
- Never use console.log() for debugging - use console.error() instead as stdout is reserved for MCP communication
- The server exposes several tools for common HTTP operations: GET, POST, PUT, DELETE, file downloads, and advanced custom curl commands
- Security is important: validate and sanitize all user inputs before passing to curl
- The executeCurl helper function should be used for all curl operations to ensure consistency and safety
