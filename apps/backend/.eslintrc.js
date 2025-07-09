/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../.eslintrc.js'],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    // Node.js specific rules
    'no-console': 'off', // Allow console.log in backend
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    
    // Performance
    'no-await-in-loop': 'warn',
  },
}; 