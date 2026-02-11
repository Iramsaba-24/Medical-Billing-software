module.exports = {
  root: true,
  env: {
    browser: true, // For renderer code
    es2020: true,
    node: true,    // Add Node for main process files
  },
  overrides: [
    {
      files: ['dist-electron/**/*.ts', 'dist-electron/**/*.js'], // main process files
      env: {
        node: true,
        browser: false, // disable browser rules for main process
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      rules: {
        // optional: Node-specific rules here
      },
    },
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
