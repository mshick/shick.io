import { omit } from '@contentlayer/utils'
import {
  ComputedFields,
  defineDocumentType,
  defineNestedType,
  FieldDefs,
  makeSource
} from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import remarkMdxImages from 'remark-mdx-images'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import remarkUnwrapImages from 'remark-unwrap-images'
import { contentDirPath, publicDir } from './env'
import {
  copyAssetAndGetUrl,
  getEditUrl,
  getExcerpt,
  getPath,
  getPublishedAt,
  getReadingTime,
  getShareUrl,
  getSiteUrl,
  getSlug,
  getTags,
  getUpdatedAt,
  getUpdatedBy,
  getUpdatedByEmail
} from './lib/fields'
import rehypeImgSize from './lib/rehype/rehype-img-size'
import remarkEpigraph from './lib/remark/remark-epigraph'
import remarkFigure from './lib/remark/remark-figure'
import remarkFooter from './lib/remark/remark-footer'
import remarkInitialHeading from './lib/remark/remark-initial-heading'
import remarkNewthought from './lib/remark/remark-newthought'
import remarkSectionize from './lib/remark/remark-sectionize'
import remarkSidenotes from './lib/remark/remark-sidenotes'
import remarkWrapImages from './lib/remark/remark-wrap-images'
import remarkYoutube from './lib/remark/remark-youtube'

const Image = defineNestedType(() => ({
  name: 'Image',
  fields: {
    asset: { type: 'image', required: true },
    title: { type: 'string', required: false },
    alt: { type: 'string', required: false },
    caption: { type: 'string', required: false }
  }
}))

const fields: FieldDefs = {
  author: { type: 'string', required: false },
  excerpt: { type: 'string', required: false },
  featuredImage: { type: 'nested', of: Image, required: false },
  isPrivate: { type: 'boolean', required: false, default: false },
  pinned: { type: 'boolean', default: false },
  publishedAt: { type: 'string', required: true },
  tags: { type: 'list', of: { type: 'string' }, required: false },
  title: { type: 'string', required: true },
  updatedAt: { type: 'string', required: false },
  featured: { type: 'boolean', required: false }
}

const computedFields: ComputedFields = {
  featuredImageUrl: {
    type: 'string',
    resolve: copyAssetAndGetUrl('featuredImage.asset')
  },
  readingTime: {
    type: 'json',
    resolve: getReadingTime
  },
  excerpt: {
    type: 'string',
    resolve: getExcerpt
  },
  slug: {
    type: 'string',
    resolve: getSlug
  },
  path: {
    type: 'string',
    resolve: getPath
  },
  updatedAt: {
    type: 'date',
    resolve: getUpdatedAt
  },
  publishedAt: {
    type: 'date',
    resolve: getPublishedAt
  },
  updatedBy: {
    type: 'string',
    resolve: getUpdatedBy
  },
  updatedByEmail: {
    type: 'string',
    resolve: getUpdatedByEmail
  },
  author: {
    type: 'string',
    resolve: async (doc) => {
      return doc.author ?? (await getUpdatedBy(doc))
    }
  },
  tags: {
    type: 'json',
    resolve: getTags
  },
  editUrl: {
    type: 'string',
    resolve: getEditUrl
  },
  shareUrl: {
    type: 'string',
    resolve: getShareUrl
  }
}

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'pages/**/*.{md,mdx}',
  contentType: 'mdx',
  fields: omit(fields, ['pinned']),
  computedFields: omit(computedFields, ['readingTime'])
}))

export const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: 'articles/**/*.{md,mdx}',
  contentType: 'mdx',
  fields,
  computedFields
}))

export const Projects = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'projects/**/*.{md,mdx}',
  contentType: 'mdx',
  fields,
  computedFields
}))

export const Config = defineDocumentType(() => ({
  name: 'Config',
  filePathPattern: 'config.yaml',
  isSingleton: true,
  contentType: 'data',
  fields: {
    siteName: {
      type: 'string',
      required: true
    },
    siteDescription: {
      type: 'string',
      required: true
    },
    locale: {
      type: 'string',
      required: true
    },
    navigation: {
      type: 'list',
      required: true,
      of: defineNestedType(() => ({
        name: 'NavigationItem',
        fields: {
          label: {
            type: 'string',
            required: true
          },
          path: {
            type: 'string',
            required: true
          },
          current: {
            type: 'boolean',
            required: true
          }
        }
      }))
    },
    seo: {
      type: 'json',
      required: true
    },
    showListeningTo: {
      type: 'boolean',
      required: true,
      default: false
    },
    repoUrl: {
      type: 'string',
      required: true
    }
  },
  computedFields: {
    siteUrl: {
      type: 'string',
      resolve: getSiteUrl
    }
  }
}))

export default makeSource({
  contentDirPath: contentDirPath,
  documentTypes: [Config, Article, Page, Projects],
  mdx: {
    remarkPlugins: [
      remarkGemoji,
      remarkDirective,
      remarkDirectiveRehype,
      remarkYoutube,
      remarkUnwrapImages,
      remarkWrapImages,
      remarkFigure,
      remarkFooter,
      remarkNewthought,
      remarkGfm,
      remarkSidenotes,
      remarkSqueezeParagraphs,
      remarkInitialHeading,
      [remarkSectionize, { maxHeadingDepth: 2 }],
      remarkEpigraph,
      remarkMdxImages
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeCodeTitles,
      [rehypePrism, { ignoreMissing: true }],
      [rehypeImgSize, { dir: contentDirPath }],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor']
          }
        }
      ]
    ],
    esbuildOptions: (options) => {
      options.platform = 'node'
      options.outdir = publicDir
      options.assetNames = `images/[name]~[hash]`
      options.loader = {
        ...options.loader,
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.svg': 'file',
        '.webp': 'file',
        '.gif': 'file'
      }
      options.publicPath = '/'
      options.write = true
      return options
    }
  }
})
