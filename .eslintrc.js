module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'sort-exports'],
  root: true,
  rules: {
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        overrides: {
          constructors: 'no-public',
        },
      },
    ],
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        default: {
          memberTypes: [
            'signature',
            'static-field',
            'static-method',
            'constructor',
            'field',
            'private-instance-field',
            'decorated-field',
            'method',
          ],
          order: 'alphabetically',
        },
        interfaces: ['signature', 'constructor', 'field', 'method'],
      },
    ],
    '@typescript-eslint/no-empty-function': ['error', { allow: ['private-constructors'] }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/react-in-jsx-scope': 'off',
    'sort-exports/sort-exports': ['warn', { sortDir: 'asc' }],
    'sort-keys': ['warn', 'asc', { caseSensitive: true, natural: false }],
  },
};
