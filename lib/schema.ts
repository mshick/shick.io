import { s } from 'velite'
import { DEFAULT_EXCERPT_LENGTH, excerptFn } from './excerpt'
import {
  createTaxonomyTransform,
  getContentPath,
  getEditUrl,
  getHistoryUrl,
  getPermalink,
  getShareUrl,
  getSlugFromPath,
  getUpdatedBy,
  getZonedDate
} from './fields'
import { markdownOptions } from './velite'

const icon = s.enum(['github', 'x', 'signal', 'linkedin', 'whatsapp', 'email'])

const cover = s.object({
  image: s.image().optional(),
  video: s.string().optional(),
  title: s.string().optional(),
  alt: s.string().optional(),
  caption: s.string().optional()
})

const count = s
  .object({ total: s.number(), posts: s.number(), pages: s.number() })
  .default({ total: 0, posts: 0, pages: 0 })

const meta = s
  .object({
    title: s.string().optional(),
    description: s.string().optional(),
    keywords: s.array(s.string()).optional()
  })
  .default({})

export const options = s.object({
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
  pagination: s.object({
    perPage: s.number()
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

export const tag = s
  .object({
    name: s.string().max(20),
    slug: s.slug('tags').optional(),
    cover: cover.optional(),
    excerpt: s.markdown({ gfm: false }).optional(),
    date: s.isodate().optional(),
    content: s.markdown(markdownOptions),
    count
  })
  .transform(createTaxonomyTransform('tags'))

export const category = s
  .object({
    name: s.string().max(20),
    slug: s.slug('categories').optional(),
    cover: cover.optional(),
    excerpt: s.markdown({ gfm: false }).optional(),
    date: s.isodate().optional(),
    content: s.markdown(markdownOptions),
    count
  })
  .transform(createTaxonomyTransform('categories'))

export const post = s
  .object({
    __type: s.literal('post').default('post'),
    slug: s.slug('posts').optional(),
    title: s.string().max(99),
    cover: cover.optional(),
    meta,
    metadata: s.metadata(),
    content: s.markdown(markdownOptions),
    excerpt: s.markdown({ gfm: false }).optional(),
    date: s.isodate().optional(),
    author: s.string().optional(),
    draft: s.boolean().default(false),
    toc: s.toc(),
    featured: s.boolean().default(false),
    categories: s.array(s.string()).default([]),
    tags: s.array(s.string()).default([]),
    related: s.array(s.string()).optional()
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
      excerpt: excerptFn({ format: 'text' }, data.excerpt, ctx),
      excerptHtml: excerptFn(
        { format: 'html', length: DEFAULT_EXCERPT_LENGTH + 40 },
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
      updatedAt: getZonedDate(updatedBy?.latestDate ?? new Date()).toISOString()
    }
  })

export const page = s
  .object({
    __type: s.literal('page').default('page'),
    title: s.string().max(99),
    excerpt: s.markdown(),
    cover: cover.optional(),
    meta,
    slug: s.slug('global', ['admin']).optional(),
    code: s.mdx({ gfm: false, copyLinkedFiles: false }),
    categories: s.array(s.string()).default([]),
    tags: s.array(s.string()).default([]),
    draft: s.boolean().default(false),
    related: s.array(s.string()).optional()
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
      updatedAt: getZonedDate(updatedBy?.latestDate ?? new Date()).toISOString()
    }
  })
