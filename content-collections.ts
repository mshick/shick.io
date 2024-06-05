import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMarkdown } from '@content-collections/markdown'

// const posts = defineCollection({
//   name: 'posts',
//   directory: 'src/posts',
//   include: '**/*.md',
//   schema: (z) => ({
//     title: z.string(),
//     summary: z.string()
//   })
// })

// const pages = defineCollection({
//   name: 'Page',
//   directory: 'content/pages',
//   fields: omit(fields, ['pinned']),
//   computedFields: omit(computedFields, ['readingTime'])
// })

const articles = defineCollection({
  name: 'Article',
  directory: 'content/articles',
  include: '*.md',
  schema: (z) => ({
    title: z.string()
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document)
    return {
      ...document,
      html
    }
  }
})

// export const Projects = defineDocumentType(() => ({
//   name: 'Project',
//   filePathPattern: 'projects/**/*.{md,mdx}',
//   contentType: 'mdx',
//   fields,
//   computedFields
// }))

export default defineConfig({
  collections: [articles]
})
