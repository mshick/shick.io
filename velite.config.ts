import { defineCollection, defineConfig } from 'velite';
import { generateCmsConfig } from '~/lib/cms';
import { CMS_CONFIG_FOLDER_PATH } from '~/lib/constants';
import {
  devUrl,
  searchIndexOutputPath,
  uploadsBaseUrl,
  uploadsFolderPath,
} from '~/lib/env';
import * as schema from '~/lib/schema';
import { generateSearchIndex } from '~/lib/search';
import { prepareTaxonomy } from '~/lib/taxonomy';
import { output, rehypePlugins, remarkPlugins } from '~/lib/velite';

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

    console.log(`Writing CMS config to '${CMS_CONFIG_FOLDER_PATH}' ...`);

    await generateCmsConfig(ctx.config, {
      ...collections.options,
      build: {
        folderPath: CMS_CONFIG_FOLDER_PATH,
        devUrl,
      },
      uploads: {
        folderPath: uploadsFolderPath,
        baseUrl: uploadsBaseUrl,
      },
    });

    console.log('CMS config written');
  },
});
