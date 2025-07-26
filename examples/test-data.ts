// Example test file for mcp-grep server
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { promises as fs } from 'fs';

// TODO: Add better error handling here
export class TestServer {
  private email = "test@example.com";
  private phone = "555-123-4567";
  private url = "https://example.com/api";
  
  // FIXME: This function needs optimization
  async processData() {
    console.log("Processing data...");
    return { status: "success" };
  }
  
  // Function to validate email addresses
  validateEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }
  
  getServerInfo() {
    return {
      name: "test-server",
      version: "1.0.0",
      contact: "admin@testserver.com"
    };
  }
}

// Sample data for testing grep patterns
const sampleData = {
  emails: [
    "user@domain.com",
    "admin@company.org", 
    "support@help-desk.net"
  ],
  ips: ["192.168.1.1", "10.0.0.1", "172.16.0.1"],
  dates: ["12/25/2023", "01-15-2024", "2024/03/10"],
  errors: [
    "Error: Connection failed",
    "WARNING: Low memory",
    "ERROR: Invalid input"
  ]
};
