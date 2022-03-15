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
import rehypeImgSize from './lib/rehype/rehype-img-size'
import rehypeSlug from 'rehype-slug'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrism from 'rehype-prism-plus'
import {
  getReadingTime,
  getExcerpt,
  getUpdatedBy,
  getUpdatedByEmail,
  getUpdatedAt,
  getPublishedAt,
  getSlug,
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

const fieldDefs: FieldDefs = {
  isPrivate: { type: 'boolean', required: false, default: false },
  title: { type: 'string', required: true },
  createdAt: { type: 'string', required: false },
  updatedAt: { type: 'string', required: false },
  publishedAt: { type: 'string', required: true },
  excerpt: { type: 'string', required: false },
  author: { type: 'string', required: false },
  image: { type: 'nested', of: Image, required: false },
  tags: { type: 'list', of: { type: 'string' }, required: false, default: [] },
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
}

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'pages/*.mdx',
  contentType: 'mdx',
  fields: {
    ...fieldDefs,
  },
  computedFields,
}))

export const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: 'articles/*.mdx',
  contentType: 'mdx',
  fields: {
    ...fieldDefs,
    pinned: { type: 'boolean', default: false },
  },
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
