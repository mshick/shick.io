import rehypePresetTufted from '@mshick/tufted/rehype'
import remarkPresetTufted from '@mshick/tufted/remark'
import remarkGemoji from 'remark-gemoji'
import { defineCollection, defineConfig, s } from 'velite'
import { excerptFn } from './lib/excerpt'
import {
  createTaxonomyTransform,
  getAvailable,
  getContentPath,
  getEditUrl,
  getHistoryUrl,
  getPermalink,
  getShareUrl,
  getSlugFromPath,
  getTaxonomy,
  getUpdatedBy,
  getZonedDate
} from './lib/fields'

// https://github.com/zce/velite/issues/134

const EXCERPT_LENGTH = 260

const icon = s.enum(['github', 'x', 'signal', 'linkedin', 'whatsapp', 'email'])

const count = s
  .object({ total: s.number(), posts: s.number(), pages: s.number() })
  .default({ total: 0, posts: 0, pages: 0 })

const preview = s.object({
  title: s.string(),
  permalink: s.string(),
  excerptHtml: s.string(),
  publishedAt: s.string()
})

const related = s.array(preview)

const meta = s
  .object({
    title: s.string().optional(),
    description: s.string().optional(),
    keywords: s.array(s.string()).optional()
  })
  .default({})

const cover = s.object({
  image: s.image().optional(),
  video: s.string().optional(),
  title: s.string().optional(),
  alt: s.string().optional(),
  caption: s.string().optional()
})

const options = defineCollection({
  name: 'Options',
  pattern: 'site/options.yml',
  single: true,
  schema: s.object({
    name: s.string().max(20),
    title: s.string().max(99),
    description: s.string().max(999),
    locale: s.string(),
    url: s.string(),
    keywords: s.array(s.string()),
    timezone: s.string(),
    repoUrlPattern: s.string().optional(),
    repoUrl: s.string().optional(),
    author: s.object({
      name: s.string(),
      email: s.string().email(),
      url: s.string().url()
    }),
    links: s.array(
      s.object({
        text: s.string(),
        path: s.string(),
        match: s.string(),
        type: s.enum(['navigation', 'footer', 'copyright']),
        current: s.boolean().default(false)
      })
    ),
    socials: s.array(
      s.object({
        name: s.string(),
        description: s.string().optional(),
        icon,
        link: s.string().optional(),
        image: s.image().optional()
      })
    ),
    collectionPaths: s
      .object({
        pages: s.string().optional(),
        posts: s.string().optional(),
        tags: s.string().optional(),
        categories: s.string().optional()
      })
      .optional()
  })
})

const tags = defineCollection({
  name: 'Tag',
  pattern: 'tags/index.yml',
  schema: s
    .object({
      name: s.string().max(20),
      slug: s.slug('tags').optional(),
      cover: cover.optional(),
      excerpt: s.markdown({ gfm: false }).optional(),
      date: s.isodate().optional(),
      content: s.markdown({ gfm: false }),
      count
    })
    .transform(createTaxonomyTransform('tags'))
})

const categories = defineCollection({
  name: 'Category',
  pattern: 'categories/*.yml',
  schema: s
    .object({
      name: s.string().max(20),
      slug: s.slug('categories').optional(),
      cover: cover.optional(),
      excerpt: s.markdown({ gfm: false }).optional(),
      date: s.isodate().optional(),
      content: s.markdown({ gfm: false }),
      count
    })
    .transform(createTaxonomyTransform('categories'))
})

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.md',
  schema: s
    .object({
      slug: s.slug('posts').optional(),
      title: s.string().max(99),
      cover: cover.optional(),
      meta,
      metadata: s.metadata(),
      content: s.markdown({ gfm: false }),
      excerpt: s.markdown({ gfm: false }).optional(),
      date: s.isodate().optional(),
      author: s.string().optional(),
      draft: s.boolean().default(false),
      toc: s.toc(),
      featured: s.boolean().default(false),
      categories: s.array(s.string()).default([]),
      tags: s.array(s.string()).default([]),
      related: related.optional()
    })
    .transform(async (data, ctx) => {
      const { meta } = ctx
      const updatedBy = await getUpdatedBy(meta.path)

      // posts/foo.md -> posts/foo
      // posts/bar/index.md -> posts/bar/index
      // posts/baz/bam.md -> posts/baz/bam
      const path = getContentPath(meta.config.root, meta.path)

      // posts/foo.md -> posts/foo -> foo
      // posts/bar/index.md -> posts/bar/index -> bar
      // posts/baz/bam.md -> posts/baz/bam -> baz/bam
      const slug = getSlugFromPath('posts', path, data.slug)

      // posts/foo.md -> posts/foo -> foo -> /foo/
      // posts/bar/index.md -> posts/bar/index -> bar -> /bar/
      // posts/baz/bam.md -> posts/baz/bam -> baz/bam -> /posts/baz/bam/
      const permalink = getPermalink('posts', path, slug)

      return {
        ...data,
        excerpt: excerptFn(
          { format: 'text', length: EXCERPT_LENGTH },
          data.excerpt,
          ctx
        ),
        excerptHtml: excerptFn(
          { format: 'html', length: EXCERPT_LENGTH + 40 },
          data.excerpt,
          ctx
        ),
        slug,
        permalink,
        author: data.author ?? updatedBy?.latestAuthorName ?? '',
        shareUrl: getShareUrl(permalink),
        editUrl: getEditUrl(meta.path),
        historyUrl: getHistoryUrl(meta.path),
        updatedBy: updatedBy?.latestAuthorName ?? '',
        updatedByEmail: updatedBy?.latestAuthorEmail ?? '',
        publishedAt: getZonedDate(
          data.date ?? updatedBy?.latestDate ?? new Date()
        ).toISOString(),
        updatedAt: getZonedDate(
          updatedBy?.latestDate ?? new Date()
        ).toISOString()
      }
    })
})

const pages = defineCollection({
  name: 'Page',
  pattern: 'pages/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(99),
      excerpt: s.markdown({ gfm: false }),
      cover: cover.optional(),
      meta,
      slug: s.slug('global', ['admin']).optional(),
      code: s.mdx(),
      categories: s.array(s.string()).default([]),
      tags: s.array(s.string()).default([]),
      draft: s.boolean().default(false)
    })
    .transform(async (data, ctx) => {
      const { meta } = ctx
      const updatedBy = await getUpdatedBy(meta.path)
      const path = getContentPath(meta.config.root, meta.path)
      const slug = getSlugFromPath('pages', path, data.slug)
      const permalink = getPermalink('pages', path, slug)
      const excerptHtml = excerptFn({ format: 'html' }, data.excerpt, ctx)
      return {
        ...data,
        // Provide a unified content as well as excerpt — should be html
        content: excerptHtml,
        excerptHtml,
        slug,
        permalink,
        shareUrl: getShareUrl(permalink),
        editUrl: getEditUrl(meta.path),
        historyUrl: getHistoryUrl(meta.path),
        publishedAt: getZonedDate(
          updatedBy?.latestDate ?? new Date()
        ).toISOString(),
        updatedAt: getZonedDate(
          updatedBy?.latestDate ?? new Date()
        ).toISOString()
      }
    })
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true
  },
  collections: {
    posts,
    pages,
    categories,
    tags,
    options
  },
  markdown: {
    // Bad velite types
    rehypePlugins: [
      rehypePresetTufted({ assets: 'public/static', base: '/static/' }) as any
    ],
    remarkPlugins: [remarkGemoji, remarkPresetTufted() as any]
  },
  mdx: {
    // Bad velite types
    rehypePlugins: [
      rehypePresetTufted({ assets: 'public/static', base: '/static/' }) as any
    ],
    remarkPlugins: [remarkGemoji, remarkPresetTufted() as any]
  },
  prepare: async (collections) => {
    const { categories, tags, posts, pages } = collections

    const docs = [...posts.filter(getAvailable), ...pages.filter(getAvailable)]

    const categoriesInDocs = new Set(docs.map((item) => item.categories).flat())

    const categoriesFromDocs = await getTaxonomy(
      'content',
      'categories',
      Array.from(categoriesInDocs).filter(
        (i) => categories.find((j) => j.name === i) == null
      )
    )

    categories.push(...categoriesFromDocs)

    categories.forEach((i) => {
      i.count.posts = posts.filter((j) => j.categories.includes(i.name)).length
      i.count.pages = pages.filter((j) => j.categories.includes(i.name)).length
      i.count.total = i.count.posts + i.count.pages
    })

    const tagsInDocs = new Set(docs.map((item) => item.tags).flat())

    const tagsFromDocs = await getTaxonomy(
      'content',
      'tags',
      Array.from(tagsInDocs).filter(
        (i) => tags.find((j) => j.name === i) == null
      )
    )

    tags.push(...tagsFromDocs)

    tags.forEach((i) => {
      i.count.posts = posts.filter((j) => j.tags.includes(i.name)).length
      i.count.pages = pages.filter((j) => j.tags.includes(i.name)).length
      i.count.total = i.count.posts + i.count.pages
    })
  }
})
