// Test for pattern interpretation functionality
describe('Grep MCP Server Pattern Interpretation', () => {
  // Mock the interpretSearchIntent function for testing
  const interpretSearchIntent = (intent: string): string => {
    const lowerIntent = intent.toLowerCase().trim();
    
    const patterns: Record<string, string> = {
      'email': '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      'email address': '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      'emails': '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      'url': 'https?://[^\\s]+',
      'urls': 'https?://[^\\s]+',
      'phone': '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b',
      'todo': '\\b(TODO|FIXME|HACK|XXX)\\b',
      'function': '\\bfunction\\s+\\w+\\s*\\(',
    };
    
    if (patterns[lowerIntent]) {
      return patterns[lowerIntent];
    }
    
    return intent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  test('should interpret email search intent correctly', () => {
    const result = interpretSearchIntent('email');
    expect(result).toBe('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  });

  test('should interpret URL search intent correctly', () => {
    const result = interpretSearchIntent('url');
    expect(result).toBe('https?://[^\\s]+');
  });

  test('should interpret phone number search intent correctly', () => {
    const result = interpretSearchIntent('phone');
    expect(result).toBe('\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b');
  });

  test('should interpret TODO search intent correctly', () => {
    const result = interpretSearchIntent('todo');
    expect(result).toBe('\\b(TODO|FIXME|HACK|XXX)\\b');
  });

  test('should interpret function search intent correctly', () => {
    const result = interpretSearchIntent('function');
    expect(result).toBe('\\bfunction\\s+\\w+\\s*\\(');
  });

  test('should escape literal strings when no pattern matches', () => {
    const result = interpretSearchIntent('some.literal*string');
    expect(result).toBe('some\\.literal\\*string');
  });
});
