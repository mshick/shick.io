import { generateCmsConfig } from '@/cms';
import { searchIndexOutputPath } from '@/env';
import { defineCollection, defineConfig } from 'velite';
import * as schema from './lib/schema';
import { generateSearchIndex } from './lib/search';
import { prepareTaxonomy } from './lib/taxonomy';
import { output, rehypePlugins, remarkPlugins } from './lib/velite';

export default defineConfig({
  root: 'content',
  output,
  collections: {
    post: defineCollection({
      name: 'Post',
      pattern: 'post/**/*.md',
      schema: schema.post,
    }),
    page: defineCollection({
      name: 'Page',
      pattern: 'page/**/*.mdx',
      schema: schema.page,
    }),
    category: defineCollection({
      name: 'Category',
      pattern: 'category/*.md',
      schema: schema.category,
    }),
    tag: defineCollection({
      name: 'Tag',
      pattern: 'tag/*.md',
      schema: schema.tag,
    }),
    author: defineCollection({
      name: 'Author',
      pattern: 'author/*.yml',
      schema: schema.authors,
    }),
    options: defineCollection({
      name: 'Options',
      pattern: 'options.yml',
      single: true,
      schema: schema.options,
    }),
  },
  mdx: {
    // TODO The MDX types incorrectly disallow these as input options to s.mdx()
    remarkPlugins,
    rehypePlugins,
  },
  async prepare(collections) {
    console.log('Preparing taxonomy...');

    const { tagCount: tagsCount, categoryCount: categoriesCount } =
      await prepareTaxonomy(collections);

    console.log(
      `Taxonomy prepared with ${tagsCount} tags and ${categoriesCount} categories`,
    );
  },

  async complete(collections, ctx) {
    const filePath = `./src/${searchIndexOutputPath}`;

    console.log(`Writing search index to '${filePath}' ...`);

    const { documentCount, termCount } = await generateSearchIndex(
      [...collections.post, ...collections.page],
      {
        filePath,
      },
    );

    console.log(
      `Search index written with ${documentCount} documents and ${termCount} terms`,
    );

    const cmsConfigFilePath = './src/generated/cms/config.json';

    console.log(`Writing CMS config to '${cmsConfigFilePath}' ...`);

    await generateCmsConfig(ctx.config, collections.options, {
      filePath: cmsConfigFilePath,
    });

    console.log('CMS config written');
  },
});
