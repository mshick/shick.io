import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files'
import readingTime from 'reading-time'
import { remarkMdxImages } from 'remark-mdx-images'
import rehypeImgSize from './lib/rehype-img-size'

const baseDir = process.cwd()
const esbuildOutdir = `${baseDir}/public`
const esbuildPublicPath = '/'
const esbuildImagesDir = 'images'

const Image = defineNestedType(() => ({
  name: 'Image',
  fields: {
    url: { type: 'string', required: true },
    title: { type: 'string', required: false },
    alt: { type: 'string', required: false },
    caption: { type: 'string', required: false },
  },
}))

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    publishedAt: { type: 'date', required: true },
    excerpt: { type: 'string', required: false },
    image: { type: 'nested', of: Image, required: false },
  },
  computedFields: {
    readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx/, ''),
    },
  },
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkMdxImages],
    rehypePlugins: [[rehypeImgSize, { dir: `data` }]],
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
