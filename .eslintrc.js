module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: ['@typescript-eslint', 'cypress'],
  extends: [
    'plugin:vue/vue3-essential',
    'airbnb-base',
    'plugin:prettier/recommended', // We added this
    'plugin:cypress/recommended',
  ],
  parser: '@typescript-eslint/parser', // Specify the TypeScript parser

  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {},
    },
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
    'no-param-reassign': ['error', { props: false }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    /* we added this */
    'no-var': 'error',
    'no-plusplus': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto', semi: false }],
    'import/prefer-default-export': 'off',
    'no-restricted-syntax': ['off', 'ForOfStatement'],

    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Allow missing file extensions
    'import/extensions': [
      'warn',
      'ignorePackages',
      {
        js: 'off',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
}
