import { generateCmsConfig } from '@/cms';
import { CMS_CONFIG_FILE_PATH } from '@/constants';
import {
  searchIndexOutputPath,
  uploadsBaseUrl,
  uploadsFolderPath,
} from '@/env';
import * as schema from '@/schema';
import { generateSearchIndex } from '@/search';
import { prepareTaxonomy } from '@/taxonomy';
import { output, rehypePlugins, remarkPlugins } from '@/velite';
import { defineCollection, defineConfig } from 'velite';

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

    console.log(`Writing CMS config to '${CMS_CONFIG_FILE_PATH}' ...`);

    await generateCmsConfig(ctx.config, {
      ...collections.options,
      outputFilePath: CMS_CONFIG_FILE_PATH,
      uploadsFolderPath,
      uploadsBaseUrl,
    });

    console.log('CMS config written');
  },
});
