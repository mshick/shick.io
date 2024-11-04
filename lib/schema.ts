import { s, type z } from 'velite'
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
import { image } from './image'
import { markdownOptions } from './velite'

export const MARKDOWN = '__MARKDOWN__'
export const ISODATE = '__ISODATE__'
export const ENUM_MULTIPLE = '__ENUM_MULTIPLE__'

const icon = s.enum(['github', 'x', 'signal', 'linkedin', 'whatsapp', 'email'])

const cover = s.object({
  image: image({ absoluteRoot: 'public' }).optional(),
  video: s.string().optional(),
  title: s.string().optional(),
  alt: s.string().optional(),
  caption: s.string().optional()
})

const count = s
  .object({ total: s.number(), posts: s.number(), pages: s.number() })
  .default({ total: 0, posts: 0, pages: 0 })

const meta = s.object({
  title: s.string().optional(),
  description: s.string().optional(),
  keywords: s.array(s.string()).optional()
})

export const options = s.object({
  name: s.string().max(20),
  title: s.string().max(99),
  description: s.string().max(999),
  locale: s.string(),
  url: s.string(),
  keywords: s.array(s.string()),
  timezone: s.string(),
  repo: s.object({
    provider: s.enum(['github']),
    name: s.string(),
    branch: s.string().default('main')
  }),
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
      link: s.string(),
      image: s.image().optional()
    })
  ),
  cms: s
    .object({
      publish_mode: s.enum(['simple', 'editorial_workflow']),
      show_preview_links: s.boolean(),
      locale: s.string(),
      editor: s
        .object({
          preview: s.boolean()
        })
        .nullable().optional(),
      slug: s
        .object({
          encoding: s.enum(['unicode', 'ascii']),
          clean_accents: s.boolean(),
          sanitize_replacement: s.string()
        })
        .nullable().optional(),
      i18n: s.object({
        structure: s.enum([
          'multiple_folders',
          'multiple_files',
          'single_file'
        ]),
        locales: s.array(s.string()).default([]),
        default_locale: s.string()
      })
    })
    .nullable().optional(),
  collections: s
    .array(
      s.object({
        name: s.enum(['pages', 'posts', 'tags', 'categories']),
        path: s.string().optional(),
        pagination: s
          .object({
            perPage: s.number()
          })
          .nullable().optional(),
        cms: s.object({
          name: s.string().optional(),
          label: s.string().optional(),
          label_singular: s.string().optional(),
          description: s.string().optional(),
          identifier_field: s.string().optional(),
          summary: s.string().optional(),
          slug: s.string().optional(),
          preview_path: s.string().optional(),
          preview_path_date_field: s.string().optional(),
          create: s.boolean().optional().default(true),
          delete: s.boolean().optional().default(true),
          editor: s.object({
            preview: s.boolean().optional().default(true)
          }).nullable().optional(),
          publish: s.boolean().optional().default(true)
        }).nullable().optional()
      })
    )
    .nullable().optional()
})

export type Options = z.infer<typeof options>

const baseTag = s.object({
  name: s.string().max(20),
  cover: cover.optional(),
  excerpt: s.markdown({ gfm: false }).optional().describe(MARKDOWN),
  date: s.isodate().describe(ISODATE).optional(),
  body: s.markdown(markdownOptions).describe(MARKDOWN),
  count
})

export const tag = baseTag.transform(createTaxonomyTransform('tags'))

export type BaseTag = z.infer<typeof baseTag>
export type Tag = z.infer<typeof tag>

export const baseCategory = s.object({
  name: s.string().max(20),
  cover: cover.optional(),
  excerpt: s.markdown({ gfm: false }).optional().describe(MARKDOWN),
  date: s.isodate().describe(ISODATE).optional(),
  body: s.markdown(markdownOptions).describe(MARKDOWN),
  count
})

export const category = baseTag.transform(createTaxonomyTransform('categories'))

export type BaseCategory = z.infer<typeof baseCategory>
export type Category = z.infer<typeof category>

export const post = s
  .object({
    __type: s.literal('post').default('post'),
    title: s.string().max(99),
    cover: cover.nullable().optional(),
    meta: meta.nullable().optional(),
    metadata: s.metadata(),
    body: s.markdown(markdownOptions).describe(MARKDOWN),
    excerpt: s.markdown({ gfm: false }).optional().describe(MARKDOWN),
    date: s.isodate().optional().describe(ISODATE),
    author: s.string().optional(),
    draft: s.boolean().optional().default(false),
    toc: s.toc(),
    featured: s.boolean().optional().default(false),
    categories: s.array(s.string()).optional(),
    tags: s.array(s.string()).optional(),
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
    // posts/bar/index.md -> posts/bar/index -> bar/index
    // posts/baz/bam.md -> posts/baz/bam -> baz/bam
    const slug = getSlugFromPath('posts', path)

    // posts/foo.md -> posts/foo -> foo -> /posts/foo/
    // posts/bar/index.md -> posts/bar/index -> bar/index -> /posts/bar/
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

export type Post = z.infer<typeof post>

export const page = s
  .object({
    __type: s.literal('page').default('page'),
    title: s.string().max(99),
    excerpt: s.markdown().describe(MARKDOWN),
    cover: cover.nullable().optional(),
    meta: meta.nullable().optional(),
    body: s.mdx({ gfm: false, copyLinkedFiles: false }).describe(MARKDOWN),
    categories: s.array(s.string()).optional(),
    tags: s.array(s.string()).optional(),
    draft: s.boolean().default(false),
    related: s.array(s.string()).optional()
  })
  .transform(async (data, ctx) => {
    const { meta } = ctx
    const updatedBy = await getUpdatedBy(meta.path)
    const path = getContentPath(meta.config.root, meta.path)
    const slug = getSlugFromPath('pages', path)
    const permalink = getPermalink('pages', path, slug)
    const excerptHtml = excerptFn({ format: 'html' }, data.excerpt, ctx)
    return {
      ...data,
      // Provide a unified content as well as excerpt — should be html
      body: excerptHtml,
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

export type Page = z.infer<typeof page>
