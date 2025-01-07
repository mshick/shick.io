import prettierConfig from 'eslint-config-prettier';
import * as mdx from 'eslint-plugin-mdx';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.md', '**/*.mdx'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parser: mdx.flat.languageOptions.parser,
      globals: {
        React: false,
        HomepagePostsList: true,
      },
    },
    plugins: {
      prettier,
      mdx,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      'mdx/remark': 'warn',
      'no-unused-expressions': 'error',
      'react/react-in-jsx-scope': 0,
    },
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
      languageMapper: {},
    }),
  },
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
    },
  },
];
