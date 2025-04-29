module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: ['@typescript-eslint', 'cypress', 'vue'],
  extends: [
    'plugin:vue/vue3-essential',
    'airbnb-base',
    'plugin:prettier/recommended', // We added this
    'plugin:cypress/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
        moduleDirectory: ['node_modules', 'packages', 'server/src'],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
    vue: {
      version: '3.0', // Explicitly specify Vue 3
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
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    'no-use-before-define': 'off',

    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

    // Allow missing file extensions
    'import/extensions': [
      'off',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-unused-vars': 'warn',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-restricted-imports': ['error', '../*'],
    'import/no-relative-packages': 'off',
    'no-await-in-loop': 'off',
  },
  overrides: [
    {
      files: ['**/tests/**/*.js', '**/tests/**/*.ts', '**/*.test.ts'],
      rules: {
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['server/**/*.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['**/packages/**/*.ts'],
      rules: {
        'no-restricted-imports': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
