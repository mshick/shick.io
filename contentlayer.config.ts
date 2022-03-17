import type { FieldDefs, ComputedFields } from 'contentlayer/source-files'
import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import remarkFootnotes from 'remark-footnotes'
import { remarkMdxImages } from 'remark-mdx-images'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import remarkSectionize from './lib/remark/remark-sectionize'
import remarkInitialHeading from './lib/remark/remark-initial-heading'
import rehypeImgSize from './lib/rehype/rehype-img-size'
import rehypeSlug from 'rehype-slug'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrism from 'rehype-prism-plus'
import { omit } from '@contentlayer/utils'
import {
  getReadingTime,
  getExcerpt,
  getUpdatedBy,
  getUpdatedByEmail,
  getUpdatedAt,
  getPublishedAt,
  getSlug,
  getPath,
  getTags,
} from './lib/utils/fields'
import { baseDir } from './lib/config'

const Image = defineNestedType(() => ({
  name: 'Image',
  fields: {
    url: { type: 'string', required: false },
    title: { type: 'string', required: false },
    alt: { type: 'string', required: false },
    caption: { type: 'string', required: false },
  },
}))

const Tag = defineNestedType(() => ({
  name: 'Tag',
  fields: {
    name: { type: 'string', required: true },
    path: { type: 'string', required: true },
  },
}))

const fields: FieldDefs = {
  author: { type: 'string', required: false },
  excerpt: { type: 'string', required: false },
  image: { type: 'nested', of: Image, required: false },
  isPrivate: { type: 'boolean', required: false, default: false },
  pinned: { type: 'boolean', default: false },
  publishedAt: { type: 'string', required: true },
  tags: { type: 'list', of: { type: 'string' }, required: false },
  title: { type: 'string', required: true },
  updatedAt: { type: 'string', required: false },
}

const computedFields: ComputedFields = {
  readingTime: {
    type: 'json',
    resolve: getReadingTime,
  },
  excerpt: {
    type: 'string',
    resolve: getExcerpt,
  },
  slug: {
    type: 'string',
    resolve: getSlug,
  },
  path: {
    type: 'string',
    resolve: getPath,
  },
  updatedAt: {
    type: 'date',
    resolve: getUpdatedAt,
  },
  publishedAt: {
    type: 'date',
    resolve: getPublishedAt,
  },
  updatedBy: {
    type: 'string',
    resolve: getUpdatedBy,
  },
  updatedByEmail: {
    type: 'string',
    resolve: getUpdatedByEmail,
  },
  author: {
    type: 'string',
    resolve: async (doc) => {
      return doc.author ?? (await getUpdatedBy(doc))
    },
  },
  tags: {
    type: 'json',
    resolve: getTags,
  },
}

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'pages/*.mdx',
  contentType: 'mdx',
  fields: omit(fields, ['pinned']),
  computedFields: omit(computedFields, ['readingTime']),
}))

export const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: 'articles/*.mdx',
  contentType: 'mdx',
  fields,
  computedFields,
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Article, Page],
  mdx: {
    remarkPlugins: [
      remarkUnwrapImages,
      remarkMdxImages,
      remarkGfm,
      remarkFootnotes,
      remarkSqueezeParagraphs,
      remarkInitialHeading,
      remarkSectionize,
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeCodeTitles,
      [rehypePrism, { ignoreMissing: true }],
      [rehypeImgSize, { dir: `data` }],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
          },
        },
      ],
    ],
    esbuildOptions: (options) => {
      options.platform = 'node'
      options.outdir = `${baseDir}/public`
      options.assetNames = `images/[dir]/[name]`
      options.loader = {
        ...options.loader,
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.svg': 'file',
        '.webp': 'file',
        '.gif': 'file',
      }
      options.publicPath = '/'
      options.write = true
      return options
    },
  },
})
