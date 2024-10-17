/**
 * This file is used for the purposes of linting the package codebase during development.
 */
import js from '@eslint/js';            // Standard JS ESLint configuration
import globals from 'globals';          // Global variables for browser and Node environments
import stylistic from '@stylistic/eslint-plugin';  // Stylistic plugin for formatting rules
export default [
  // Base recommended config
  js.configs.recommended,
  // Custom configuration for your files
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,        // Include Node.js global variables
        ...globals.browser,     // Include browser global variables
      },
      ecmaVersion: 'latest',    // Set the latest ECMAScript version
      sourceType: 'module',     // Enable ES module syntax
    },
    plugins: {
      '@stylistic': stylistic,  // Use stylistic plugin for code style rules
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],  // Allow `console.warn` and `console.error`, but warn for others
      'no-undef': 'warn',             // Warn about undefined variables
      'no-unused-vars': 'warn',       // Warn about unused variables
      'no-shadow': 'warn',            // Warn about variable shadowing
      '@stylistic/semi': ['error', 'always'],   // Enforce semicolons
      '@stylistic/quotes': ['error', 'single'], // Enforce single quotes
      '@stylistic/indent': ['error', 2],        // Enforce 2 spaces for indentation
      '@stylistic/keyword-spacing': 'warn',     // Warn about inconsistent keyword spacing
    }
  }
];
