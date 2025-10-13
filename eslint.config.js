/**
 * This file is used for the purposes of linting the package codebase during development.
 */
import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default [
  // Base recommended config
  js.configs.recommended,

  ...tseslint.configs.recommended,
  // Custom configuration for your files
  {
    files: ['**/*.js,ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'no-shadow': 'warn',
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/keyword-spacing': 'warn',
    }
  },
  // Test files configuration
  {
    files: ['**/*.spec.js', '**/*.test.js', '**/*.spec.ts', '**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        global: 'writable',
      },
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off',
    }
  }
];
