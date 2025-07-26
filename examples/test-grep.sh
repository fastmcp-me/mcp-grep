#!/bin/bash

# Test script for grep-mcp server
# This script demonstrates the grep-mcp functionality

echo "Testing grep-mcp server functionality..."
echo "========================================"

# Create a test file with various patterns
cat > test-content.txt << 'EOF'
Contact us at support@example.com or admin@company.org
You can also call us at 555-123-4567 or 1-800-555-0199
Visit our website: https://www.example.com/help
Server IP: 192.168.1.100
Updated on: 12/25/2023

TODO: Fix the login bug
FIXME: Optimize database queries
WARNING: Memory usage is high
Error: Connection timeout occurred

function getUserData(userId) {
    return database.query('SELECT * FROM users WHERE id = ?', userId);
}

class UserManager {
    constructor() {
        this.users = [];
    }
}

import { readFile } from 'fs/promises';
export const API_URL = 'https://api.service.com/v1';
EOF

echo "Created test-content.txt with sample patterns"
echo ""

# Test natural language search for emails
echo "1. Testing natural language search for 'email addresses':"
echo "--------------------------------------------------------"
grep -E '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' test-content.txt
echo ""

# Test phone number search
echo "2. Testing natural language search for 'phone numbers':"
echo "-------------------------------------------------------" 
grep -E '\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b1-\d{3}-\d{3}-\d{4}\b' test-content.txt
echo ""

# Test URL search
echo "3. Testing natural language search for 'URLs':"
echo "----------------------------------------------"
grep -E 'https?://[^\s]+' test-content.txt
echo ""

# Test TODO comments
echo "4. Testing natural language search for 'TODO comments':"
echo "-------------------------------------------------------"
grep -E '\b(TODO|FIXME|HACK|XXX)\b' test-content.txt
echo ""

# Test function definitions
echo "5. Testing regex search for 'function definitions':"
echo "---------------------------------------------------"
grep -E '\bfunction\s+\w+\s*\(' test-content.txt
echo ""

# Clean up
rm test-content.txt

echo "Test completed! The grep-mcp server provides these search capabilities through MCP tools."
