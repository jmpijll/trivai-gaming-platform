/** @type {import('prettier').Config} */
module.exports = {
  // Print width
  printWidth: 120,
  
  // Tab width
  tabWidth: 2,
  
  // Use spaces instead of tabs
  useTabs: false,
  
  // Semicolons
  semi: true,
  
  // Single quotes
  singleQuote: true,
  
  // Quote properties
  quoteProps: 'as-needed',
  
  // JSX quotes
  jsxSingleQuote: true,
  
  // Trailing commas
  trailingComma: 'es5',
  
  // Bracket spacing
  bracketSpacing: true,
  
  // JSX bracket same line
  jsxBracketSameLine: false,
  
  // Arrow function parentheses
  arrowParens: 'avoid',
  
  // Range
  rangeStart: 0,
  rangeEnd: Infinity,
  
  // Require pragma
  requirePragma: false,
  
  // Insert pragma
  insertPragma: false,
  
  // Prose wrap
  proseWrap: 'preserve',
  
  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',
  
  // Vue indent script and style
  vueIndentScriptAndStyle: false,
  
  // End of line
  endOfLine: 'lf',
  
  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',
  
  // Override for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.{css,scss}',
      options: {
        singleQuote: false,
      },
    },
  ],
}; 