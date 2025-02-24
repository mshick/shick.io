import rehypePresetTufted from '@mshick/tufted/rehype';
import remarkPresetTufted from '@mshick/tufted/remark';
import type { ElementContent } from 'hast';
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic';
import remarkGemoji from 'remark-gemoji';
import type { PluggableList } from 'unified';
import type { MarkdownOptions, Output } from 'velite';
import { rehypeCopyLinkedFiles } from './assets';
import { publicRootPath, uploadsBaseUrl, uploadsFolderPath } from './env';

export const output: Output = {
  data: '.velite',
  assets: 'public/static',
  base: '/static/',
  name: '[name]-[hash:6].[ext]',
  clean: true,
  format: 'esm',
};

export const rehypeTufted = rehypePresetTufted();

export const remarkPlugins: PluggableList = [
  remarkGemoji,
  remarkPresetTufted(),
];

export const rehypePlugins: PluggableList = [
  [
    rehypeCopyLinkedFiles,
    {
      ...output,
      publicRootPath,
      uploads: {
        baseUrl: uploadsBaseUrl,
        folderPath: uploadsFolderPath,
      },
    },
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
