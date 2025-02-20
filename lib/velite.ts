import rehypePresetTufted from '@mshick/tufted/rehype';
import remarkPresetTufted from '@mshick/tufted/remark';
import type { ElementContent } from 'hast';
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic';
import remarkGemoji from 'remark-gemoji';
import type { PluggableList } from 'unified';
import type { MarkdownOptions, Output } from 'velite';
import { rehypeCopyLinkedFiles } from './assets';
import { UPLOADS_BASE, UPLOADS_PATH } from './constants';

export const output: Output = {
  data: '.velite',
  assets: 'public/static',
  base: '/static/',
  name: '[name]-[hash:6].[ext]',
  clean: true,
  format: 'esm',
};

export const rehypeTufted = rehypePresetTufted({
  plugins: {
    rehypeShiki: {
      themes: {
        light: 'one-light',
        dark: 'one-dark-pro',
      },
    },
    rehypeAutolinkHeadings: {
      behavior: 'append',
      content: fromHtmlIsomorphic('#', {
        fragment: true,
      }).children as ElementContent[],
      headingProperties: {
        className: ['group'],
      },
      properties: {
        className: [
          'heading-link',
          'hidden',
          'group-hover:inline-block',
          'ml-2',
        ],
      },
    },
  },
});

export const remarkPlugins: PluggableList = [
  remarkGemoji,
  remarkPresetTufted(),
];

export const rehypePlugins: PluggableList = [
  [
    rehypeCopyLinkedFiles,
    { ...output, uploads: { base: UPLOADS_BASE, path: UPLOADS_PATH } },
  ],
  rehypeTufted,
];

export const markdownOptions: MarkdownOptions = {
  gfm: false,
  // @ts-expect-error Bad types
  remarkPlugins,
  // @ts-expect-error Bad types
  rehypePlugins,
  removeComments: true,
  copyLinkedFiles: false,
};
