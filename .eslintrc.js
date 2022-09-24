const { getGlobals } = require('eslint-plugin-mdx/lib/helpers')

module.exports = {
  parserOptions: {
    ecmaVersion: 12
  },
  extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
  rules: {
    'no-console': 'error',
    'no-unreachable': 'error'
  },
  overrides: [
    {
      files: ['scripts/**/*'],
      rules: {
        'no-console': 'off'
      }
    },
    {
      files: ['*.json'],
      plugins: ['json-format']
    },
    {
      files: ['*.mdx', '*.md'],
      settings: {
        'mdx/code-blocks': false,
        'mdx/language-mapper': {}
      },
      extends: 'plugin:mdx/recommended',
      rules: {
        indent: 'off'
      },
      globals: {
        HomepageHero: false,
        HomepageArticles: false
      }
    }
  ],
  ignorePatterns: ['tsconfig.json', 'package-lock.json']
}
