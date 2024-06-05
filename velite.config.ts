import { defineCollection, defineConfig, s } from 'velite'
import {
  getEditUrl,
  getPermalink,
  getShareUrl,
  getTags,
  getUpdatedBy,
  getZonedDate
} from './lib/velite'

// https://github.com/zce/velite/issues/134

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.md',
  schema: s
    .object({
      path: s.path({}),
      title: s.string().max(99),
      slug: s.slug('posts').optional(),
      cover: s
        .object({
          image: s.image().optional(),
          video: s.file().optional(),
          title: s.string().optional(),
          alt: s.string().optional(),
          caption: s.string().optional()
        })
        .optional(),
      metadata: s.metadata(),
      excerpt: s.excerpt(),
      content: s.markdown(),
      date: s.isodate().optional(),
      author: s.string().optional(),
      pinned: s.boolean().default(false),
      draft: s.boolean().default(false),
      toc: s.toc(),
      tags: s.array(s.string()).default([]).transform(getTags)
    })
    .transform(async (data, { meta }) => {
      const updatedBy = await getUpdatedBy(meta.path)
      const permalink = getPermalink('posts', data.path, data.slug)
      return {
        ...data,
        permalink,
        author: data.author ?? updatedBy?.latestAuthorName ?? '',
        shareUrl: getShareUrl(permalink),
        editUrl: getEditUrl(meta.path),
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
      path: s.path({}),
      title: s.string().max(99),
      slug: s.slug('posts').optional(),
      cover: s
        .object({
          image: s.image().optional(),
          video: s.file().optional(),
          title: s.string().optional(),
          alt: s.string().optional(),
          caption: s.string().optional()
        })
        .optional(),
      metadata: s.metadata(),
      excerpt: s.excerpt(),
      content: s.mdx(),
      date: s.isodate().optional(),
      author: s.string().optional(),
      draft: s.boolean().default(false),
      toc: s.toc(),
      tags: s.array(s.string()).default([]).transform(getTags)
    })
    .transform(async (data, { meta }) => {
      const updatedBy = await getUpdatedBy(meta.path)
      const permalink = getPermalink('posts', data.path, data.slug)
      return {
        ...data,
        permalink,
        author: data.author ?? updatedBy?.latestAuthorName ?? '',
        shareUrl: getShareUrl(permalink),
        editUrl: getEditUrl(meta.path),
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

const configs = defineCollection({
  name: 'Config',
  pattern: 'config.yaml',
  schema: s.object({
    locale: s.string(),
    siteName: s.string()
  })
})

export default defineConfig({
  collections: {
    posts,
    pages,
    configs
  }
})
