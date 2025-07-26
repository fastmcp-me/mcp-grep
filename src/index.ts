#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { spawn } from "child_process";
import { existsSync, statSync } from "fs";
import { resolve } from "path";

// Create server instance
const server = new McpServer({
  name: "grep-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Helper function to execute grep command safely
async function executeGrep(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    // Ensure we're only calling grep with safe arguments
    if (!args.includes('grep')) {
      args.unshift('grep');
    }
    
    const child = spawn('grep', args.slice(1), {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        stdout,
        stderr,
        exitCode: code || 0,
      });
    });

    child.on('error', (error) => {
      resolve({
        stdout: '',
        stderr: error.message,
        exitCode: 1,
      });
    });
  });
}

// Helper function to validate file/directory paths
function validatePath(path: string): { isValid: boolean; isDirectory: boolean; error?: string } {
  try {
    const resolvedPath = resolve(path);
    if (!existsSync(resolvedPath)) {
      return { isValid: false, isDirectory: false, error: `Path does not exist: ${path}` };
    }
    const stats = statSync(resolvedPath);
    return { isValid: true, isDirectory: stats.isDirectory() };
  } catch (error) {
    return { isValid: false, isDirectory: false, error: `Invalid path: ${path}` };
  }
}

// Helper function to convert plain English search intent to regex patterns
function interpretSearchIntent(intent: string): string {
  const lowerIntent = intent.toLowerCase().trim();
  
  // Common search patterns
  const patterns: Record<string, string> = {
    // Email patterns
    'email': '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    'email address': '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    'emails': '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    
    // URL patterns  
    'url': 'https?://[^\\s]+',
    'urls': 'https?://[^\\s]+',
    'website': 'https?://[^\\s]+',
    'link': 'https?://[^\\s]+',
    'links': 'https?://[^\\s]+',
    
    // IP addresses
    'ip address': '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
    'ip addresses': '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
    'ip': '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
    
    // Phone numbers
    'phone number': '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b',
    'phone numbers': '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b',
    'phone': '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b',
    
    // Dates
    'date': '\\b\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}\\b',
    'dates': '\\b\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}\\b',
    
    // Numbers
    'number': '\\b\\d+\\b',
    'numbers': '\\b\\d+\\b',
    'integer': '\\b\\d+\\b',
    'integers': '\\b\\d+\\b',
    
    // Common code patterns
    'function': '\\bfunction\\s+\\w+\\s*\\(',
    'functions': '\\bfunction\\s+\\w+\\s*\\(',
    'class': '\\bclass\\s+\\w+',
    'classes': '\\bclass\\s+\\w+',
    'import': '^\\s*import\\b',
    'imports': '^\\s*import\\b',
    'export': '^\\s*export\\b',
    'exports': '^\\s*export\\b',
    
    // Common file types
    'todo': '\\b(TODO|FIXME|HACK|XXX)\\b',
    'todos': '\\b(TODO|FIXME|HACK|XXX)\\b',
    'comment': '^\\s*(/\\*|//|#)',
    'comments': '^\\s*(/\\*|//|#)',
    
    // Error patterns
    'error': '\\b(error|Error|ERROR)\\b',
    'errors': '\\b(error|Error|ERROR)\\b',
    'warning': '\\b(warning|Warning|WARNING)\\b',
    'warnings': '\\b(warning|Warning|WARNING)\\b',
  };
  
  // Check for exact matches first
  if (patterns[lowerIntent]) {
    return patterns[lowerIntent];
  }
  
  // Check for partial matches
  for (const [key, pattern] of Object.entries(patterns)) {
    if (lowerIntent.includes(key)) {
      return pattern;
    }
  }
  
  // If no pattern matches, treat as literal string search (escaped for regex)
  return intent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Tool: Search with plain English intent
server.tool(
  "grep_search_intent",
  "Search for patterns using plain English descriptions (e.g., 'email addresses', 'phone numbers', 'TODO comments')",
  {
    intent: z.string().describe("Plain English description of what to search for"),
    target: z.string().describe("File or directory path to search in"),
    case_sensitive: z.boolean().optional().default(false).describe("Whether the search should be case sensitive"),
    max_results: z.number().optional().describe("Maximum number of results to return"),
    show_context: z.boolean().optional().default(false).describe("Show surrounding lines for context"),
    context_lines: z.number().optional().default(2).describe("Number of context lines to show before/after matches"),
  },
  async ({ intent, target, case_sensitive, max_results, show_context, context_lines }) => {
    // Validate target path
    const pathValidation = validatePath(target);
    if (!pathValidation.isValid) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${pathValidation.error}`,
          },
        ],
      };
    }

    const args = ['grep'];
    
    // Convert intent to regex pattern
    const pattern = interpretSearchIntent(intent);
    args.push('-E'); // Use extended regex
    args.push(pattern);
    
    // Add case sensitivity option
    if (!case_sensitive) {
      args.push('-i');
    }
    
    // Add recursive search if target is directory
    if (pathValidation.isDirectory) {
      args.push('-r');
    }
    
    // Add line numbers
    args.push('-n');
    
    // Add context if requested
    if (show_context && context_lines > 0) {
      args.push(`-C${context_lines}`);
    }
    
    // Add max results limit
    if (max_results) {
      args.push('-m', max_results.toString());
    }
    
    // Add target path
    args.push(target);
    
    try {
      const result = await executeGrep(args);
      
      return {
        content: [
          {
            type: "text",
            text: `Search Intent: "${intent}"\nPattern Used: ${pattern}\nExit Code: ${result.exitCode}\n\nResults:\n${result.stdout}${result.stderr ? `\n\nErrors:\n${result.stderr}` : ''}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing grep: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// Tool: Direct regex pattern search
server.tool(
  "grep_regex",
  "Search using a direct regex pattern",
  {
    pattern: z.string().describe("Regular expression pattern to search for"),
    target: z.string().describe("File or directory path to search in"),
    case_sensitive: z.boolean().optional().default(false).describe("Whether the search should be case sensitive"),
    whole_words: z.boolean().optional().default(false).describe("Match whole words only"),
    invert_match: z.boolean().optional().default(false).describe("Show lines that don't match the pattern"),
    max_results: z.number().optional().describe("Maximum number of results to return"),
    show_context: z.boolean().optional().default(false).describe("Show surrounding lines for context"),
    context_lines: z.number().optional().default(2).describe("Number of context lines to show before/after matches"),
    file_extensions: z.array(z.string()).optional().describe("Only search files with these extensions (e.g., ['js', 'ts'])"),
  },
  async ({ pattern, target, case_sensitive, whole_words, invert_match, max_results, show_context, context_lines, file_extensions }) => {
    // Validate target path
    const pathValidation = validatePath(target);
    if (!pathValidation.isValid) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${pathValidation.error}`,
          },
        ],
      };
    }

    const args = ['grep'];
    
    // Use extended regex
    args.push('-E');
    args.push(pattern);
    
    // Add case sensitivity option
    if (!case_sensitive) {
      args.push('-i');
    }
    
    // Add whole words option
    if (whole_words) {
      args.push('-w');
    }
    
    // Add invert match option
    if (invert_match) {
      args.push('-v');
    }
    
    // Add recursive search if target is directory
    if (pathValidation.isDirectory) {
      args.push('-r');
    }
    
    // Add line numbers
    args.push('-n');
    
    // Add context if requested
    if (show_context && context_lines > 0) {
      args.push(`-C${context_lines}`);
    }
    
    // Add max results limit
    if (max_results) {
      args.push('-m', max_results.toString());
    }
    
    // Add file extension filters
    if (file_extensions && file_extensions.length > 0 && pathValidation.isDirectory) {
      file_extensions.forEach(ext => {
        args.push('--include', `*.${ext}`);
      });
    }
    
    // Add target path
    args.push(target);
    
    try {
      const result = await executeGrep(args);
      
      return {
        content: [
          {
            type: "text",
            text: `Pattern: ${pattern}\nExit Code: ${result.exitCode}\n\nResults:\n${result.stdout}${result.stderr ? `\n\nErrors:\n${result.stderr}` : ''}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing grep: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// Tool: Count matches
server.tool(
  "grep_count",
  "Count the number of matches for a pattern",
  {
    pattern: z.string().describe("Regular expression pattern or plain text to count"),
    target: z.string().describe("File or directory path to search in"),
    case_sensitive: z.boolean().optional().default(false).describe("Whether the search should be case sensitive"),
    whole_words: z.boolean().optional().default(false).describe("Match whole words only"),
    by_file: z.boolean().optional().default(false).describe("Show count per file when searching directories"),
    file_extensions: z.array(z.string()).optional().describe("Only search files with these extensions"),
  },
  async ({ pattern, target, case_sensitive, whole_words, by_file, file_extensions }) => {
    // Validate target path
    const pathValidation = validatePath(target);
    if (!pathValidation.isValid) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${pathValidation.error}`,
          },
        ],
      };
    }

    const args = ['grep'];
    
    // Add count option
    args.push('-c');
    
    // Use extended regex
    args.push('-E');
    args.push(pattern);
    
    // Add case sensitivity option
    if (!case_sensitive) {
      args.push('-i');
    }
    
    // Add whole words option
    if (whole_words) {
      args.push('-w');
    }
    
    // Add recursive search if target is directory
    if (pathValidation.isDirectory) {
      args.push('-r');
      
      // Add filename display for directory searches
      if (by_file) {
        args.push('-H');
      }
    }
    
    // Add file extension filters
    if (file_extensions && file_extensions.length > 0 && pathValidation.isDirectory) {
      file_extensions.forEach(ext => {
        args.push('--include', `*.${ext}`);
      });
    }
    
    // Add target path
    args.push(target);
    
    try {
      const result = await executeGrep(args);
      
      return {
        content: [
          {
            type: "text",
            text: `Pattern: ${pattern}\nExit Code: ${result.exitCode}\n\nMatch Counts:\n${result.stdout}${result.stderr ? `\n\nErrors:\n${result.stderr}` : ''}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing grep: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// Tool: Find files containing pattern
server.tool(
  "grep_files_with_matches",
  "List only the names of files that contain the pattern",
  {
    pattern: z.string().describe("Regular expression pattern or plain text to search for"),
    target: z.string().describe("Directory path to search in"),
    case_sensitive: z.boolean().optional().default(false).describe("Whether the search should be case sensitive"),
    whole_words: z.boolean().optional().default(false).describe("Match whole words only"),
    file_extensions: z.array(z.string()).optional().describe("Only search files with these extensions"),
    exclude_patterns: z.array(z.string()).optional().describe("Exclude files matching these patterns"),
  },
  async ({ pattern, target, case_sensitive, whole_words, file_extensions, exclude_patterns }) => {
    // Validate target path
    const pathValidation = validatePath(target);
    if (!pathValidation.isValid) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${pathValidation.error}`,
          },
        ],
      };
    }

    if (!pathValidation.isDirectory) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Target must be a directory for this operation`,
          },
        ],
      };
    }

    const args = ['grep'];
    
    // List filenames only
    args.push('-l');
    
    // Use extended regex
    args.push('-E');
    args.push(pattern);
    
    // Add case sensitivity option
    if (!case_sensitive) {
      args.push('-i');
    }
    
    // Add whole words option
    if (whole_words) {
      args.push('-w');
    }
    
    // Add recursive search
    args.push('-r');
    
    // Add file extension filters
    if (file_extensions && file_extensions.length > 0) {
      file_extensions.forEach(ext => {
        args.push('--include', `*.${ext}`);
      });
    }
    
    // Add exclusion patterns
    if (exclude_patterns && exclude_patterns.length > 0) {
      exclude_patterns.forEach(excludePattern => {
        args.push('--exclude', excludePattern);
      });
    }
    
    // Add target path
    args.push(target);
    
    try {
      const result = await executeGrep(args);
      
      return {
        content: [
          {
            type: "text",
            text: `Pattern: ${pattern}\nExit Code: ${result.exitCode}\n\nFiles containing matches:\n${result.stdout}${result.stderr ? `\n\nErrors:\n${result.stderr}` : ''}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing grep: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// Tool: Advanced grep with custom options
server.tool(
  "grep_advanced",
  "Execute grep with custom arguments (advanced usage)",
  {
    args: z.array(z.string()).describe("Array of grep arguments (excluding 'grep' itself)"),
  },
  async ({ args }) => {
    // Basic validation to prevent potentially dangerous operations
    const dangerousFlags = [
      '--devices=', // Device operations could be dangerous
      '--binary-files=', // Binary file operations
      '-f', '--file', // Reading patterns from files
      '-D', '--devices', // Device handling
    ];
    
    const hasUnsafeFlag = args.some(arg => 
      dangerousFlags.some(dangerous => arg.startsWith(dangerous))
    );
    
    if (hasUnsafeFlag) {
      return {
        content: [
          {
            type: "text",
            text: `Error: This command contains potentially unsafe flags. Please use the specific grep tools for safety.`,
          },
        ],
      };
    }
    
    try {
      const result = await executeGrep(['grep', ...args]);
      
      return {
        content: [
          {
            type: "text",
            text: `Exit Code: ${result.exitCode}\n\nResults:\n${result.stdout}${result.stderr ? `\n\nErrors:\n${result.stderr}` : ''}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing grep: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr since stdout is used for MCP communication
  console.error("Grep MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
