import type { FieldDefs, ComputedFields } from 'contentlayer/source-files'
import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files'
import path from 'path'
import dateFns from 'date-fns-tz'
import readingTime from 'reading-time'
import remarkGfm from 'remark-gfm'
import remarkFootnotes from 'remark-footnotes'
import { remarkMdxImages } from 'remark-mdx-images'
import rehypeImgSize from './lib/rehype-img-size'
import rehypeSlug from 'rehype-slug'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrism from 'rehype-prism-plus'
import { sanitizeMdx, getExcerpt } from './lib/utils/body'
import {
  getGitInfoCached,
  createDateWithGitFallbackGetter,
} from './lib/utils/git'
import { assertEnv } from './lib/utils/env'

const { zonedTimeToUtc } = dateFns

const baseDir = process.cwd()
const timezone = assertEnv('TIMEZONE', 'America/New_York')
const contentDir = assertEnv('CONTENT_DIR', 'data')
const esbuildOutdir = `${baseDir}/public`
const esbuildPublicPath = '/'
const esbuildImagesDir = 'images'

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

function getContentPath(sourceFilePath: string): string {
  return path.join(contentDir, sourceFilePath)
}

const getDateWithFallback = createDateWithGitFallbackGetter(
  baseDir,
  contentDir,
  timezone
)

const computedFields: ComputedFields = {
  readingTime: {
    type: 'json',
    resolve: (doc) => readingTime(sanitizeMdx(doc.body.raw)),
  },
  excerpt: { type: 'json', resolve: (doc) => getExcerpt(doc.body.raw) },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx/, ''),
  },
  createdAt: {
    type: 'date',
    resolve: async (doc) =>
      await getDateWithFallback(doc.createdAt, doc._raw.sourceFilePath),
  },
  updatedAt: {
    type: 'date',
    resolve: async (doc) =>
      await getDateWithFallback(doc.updatedAt, doc._raw.sourceFilePath),
  },
  publishedAt: {
    type: 'date',
    resolve: (doc) =>
      doc.publishedAt
        ? zonedTimeToUtc(doc.publishedAt, timezone).toISOString()
        : '',
  },
  updatedBy: {
    type: 'string',
    resolve: async (doc) => {
      return (
        (
          await getGitInfoCached(
            baseDir,
            getContentPath(doc._raw.sourceFilePath)
          )
        ).latestAuthorName ?? ''
      )
    },
  },
  updatedByEmail: {
    type: 'string',
    resolve: async (doc) => {
      return (
        (
          await getGitInfoCached(
            baseDir,
            getContentPath(doc._raw.sourceFilePath)
          )
        ).latestAuthorEmail ?? ''
      )
    },
  },
  author: {
    type: 'string',
    resolve: async (doc) => {
      return (
        doc.author ??
        (
          await getGitInfoCached(
            baseDir,
            path.join(contentDir, doc._raw.sourceFilePath)
          )
        ).latestAuthorName ??
        ''
      )
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
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx/, ''),
    },
  },
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
    remarkPlugins: [remarkMdxImages, remarkGfm, remarkFootnotes],
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
      options.outdir = esbuildOutdir
      options.assetNames = `${esbuildImagesDir}/[dir]/[name]`
      options.loader = {
        ...options.loader,
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.svg': 'file',
        '.webp': 'file',
        '.gif': 'file',
      }
      options.publicPath = esbuildPublicPath
      options.write = true
      return options
    },
  },
})
