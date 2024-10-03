import { searchIndexOutputPath } from '@/env'
import { defineCollection, defineConfig } from 'velite'
import * as schema from './lib/schema'
import { generateSearchIndex } from './lib/search'
import { prepareTaxonomy } from './lib/taxonomy'
import { output, rehypePlugins, remarkPlugins } from './lib/velite'

export default defineConfig({
  root: 'content',
  output,
  collections: {
    posts: defineCollection({
      name: 'Post',
      pattern: 'posts/**/*.md',
      schema: schema.post
    }),
    pages: defineCollection({
      name: 'Page',
      pattern: 'pages/**/*.mdx',
      schema: schema.page
    }),
    categories: defineCollection({
      name: 'Category',
      pattern: 'categories/*.yml',
      schema: schema.category
    }),
    tags: defineCollection({
      name: 'Tag',
      pattern: 'tags/index.yml',
      schema: schema.tag
    }),
    options: defineCollection({
      name: 'Options',
      pattern: 'site/options.yml',
      single: true,
      schema: schema.options
    })
  },
  mdx: {
    // TODO The MDX types incorrectly disallow these as input options to s.mdx()
    remarkPlugins,
    rehypePlugins
  },
  async prepare(collections) {
    console.log('Preparing taxonomy...')

    const { tagCount: tagsCount, categoryCount: categoriesCount } =
      await prepareTaxonomy(collections)

    console.log(
      `Taxonomy prepared with ${tagsCount} tags and ${categoriesCount} categories`
    )
  },

  async complete(collections) {
    const filePath = `./src/${searchIndexOutputPath}`

    console.log(`Writing search index to '${filePath}' ...`)

    const { documentCount, termCount } = await generateSearchIndex(
      [...collections.posts, ...collections.pages],
      {
        filePath
      }
    )

    // TODO Process schemas and turn into decap cms config, write to generated

    console.log(
      `Search index written with ${documentCount} documents and ${termCount} terms`
    )
  }
})
