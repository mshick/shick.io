import { defineCollection, defineConfig, s } from 'velite'
import { getUpdatedByVelite } from './lib/fields'

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.md',
  schema: s
    .object({
      path: s.path(),
      title: s.string().max(99),
      slug: s.slug('posts'),
      date: s.isodate(),
      cover: s.image(),
      video: s.file().optional(),
      metadata: s.metadata(),
      excerpt: s.excerpt(),
      content: s.markdown(),
      author: s.string().optional()
    })
    .transform(async (data) => {
      return {
        ...data,
        author: data.author ?? (await getUpdatedByVelite(data.path))
      }
    })
})

export default defineConfig({
  collections: {
    posts
  }
})
