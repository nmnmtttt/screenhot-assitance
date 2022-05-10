module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    webextensions: true,
  },
  root: true,
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:react/recommended', 'kagura'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  rules: {
    'prefer-destructuring': ['never'],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-mixed-operators': 0,
    'common-dangle': ['never'],
  },
}
