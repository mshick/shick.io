import { existsSync, mkdirSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, sep } from 'node:path';
import { cwd } from 'node:process';
import merge from 'lodash/merge.js';
import trim from 'lodash/trim.js';
import { type Collection, type Config, z } from 'velite';
import type { Options } from '../schema';
import { getSchemaBaseType, schemaToFields, sortSchemaFields } from './schema';
import {
  type CmsCollection,
  CmsCollectionFormatType,
  type CmsConfig,
} from './types';
import { makeSparse } from './util';

function getCollectionPath(pattern: string) {
  const parts = pattern.split(sep);
  const globRe = /[*|[]/;
  const globStart = parts.findIndex((p) => globRe.exec(p));
  return globStart > -1 ? parts.slice(0, globStart) : parts;
}

function addFolderCollectionFolders(
  cmsCollection: Partial<CmsCollection>,
  options: CreateCmsCollectionOptions,
  pattern: string,
) {
  const { contentBasePath, uploads } = options;
  const collectionPath = getCollectionPath(pattern);

  cmsCollection.folder = join(contentBasePath, ...collectionPath);
  cmsCollection.media_folder = join(uploads.folderPath, ...collectionPath);
  cmsCollection.public_folder = join(uploads.baseUrl, ...collectionPath, '/');

  if (!existsSync(cmsCollection.media_folder)) {
    mkdirSync(cmsCollection.media_folder, { recursive: true });
  }
}

type CreateCmsCollectionOptions = {
  cms?: Partial<CmsCollection>;
  contentBasePath: string;
  name: string;
  path?: string;
  uploads: UploadsOptions;
};

function createCmsCollection(
  options: CreateCmsCollectionOptions,
  collection: Collection,
): CmsCollection {
  const { name, path, cms } = options;
  const collectionBasePath = path ?? `/${name}`;

  const cmsCollection: Partial<CmsCollection> = {
    label: collection.name,
    name,
    preview_path: join(collectionBasePath, '{{slug}}'),
  };

  const pattern = Array.isArray(collection.pattern)
    ? collection.pattern[0]
    : collection.pattern;

  if (!pattern) {
    throw new Error(`Invalid pattern in collection ${collection.name}`);
  }

  if (collection.single) {
    cmsCollection.type = 'file_based_collection';
    cmsCollection.files = [
      {
        file: join(options.contentBasePath, ...getCollectionPath(pattern)),
        name: pattern,
        label: pattern,
        fields: [],
      },
    ];
  } else {
    cmsCollection.type = 'folder_based_collection';

    addFolderCollectionFolders(cmsCollection, options, pattern);

    cmsCollection.create = true;
    cmsCollection.extension = trim(extname(pattern).toLowerCase(), '.');

    if (['yml', 'yaml'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.YAML;
    }

    if (['toml'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.TOML;
    }

    if (['json'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.JSON;
    }

    if (['md', 'markdown'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.YAMLFrontmatter;
    }

    if (['mdx'].includes(cmsCollection.extension)) {
      cmsCollection.format = CmsCollectionFormatType.Frontmatter;
    }
  }

  return merge(cmsCollection, cms) as CmsCollection;
}

function addCollectionFields(
  collection: Collection,
  cmsCollection: CmsCollection,
  cmsCollections: CmsCollection[],
) {
  const schema = getSchemaBaseType(collection.schema, {});

  if (!(schema instanceof z.ZodObject)) {
    throw new Error('Invalid schema provided, must be of type object');
  }

  if ('files' in cmsCollection) {
    cmsCollection.files![0]!.fields = sortSchemaFields(
      schemaToFields(schema, cmsCollection, cmsCollections),
    );
  } else {
    cmsCollection.fields = sortSchemaFields(
      schemaToFields(schema, cmsCollection, cmsCollections),
    );
  }
}

type UploadsOptions = {
  folderPath: string;
  baseUrl: string;
};

function getCmsCollections(
  context: { config: Config },
  options: Pick<Options, 'url' | 'repo' | 'collections' | 'cms'> & {
    uploads: UploadsOptions;
  },
) {
  const { config } = context;
  const { uploads } = options;
  const contentBasePath = relative(cwd(), config.root);

  const collections: CmsCollection[] = [];

  for (const [name, collection] of Object.entries(config.collections)) {
    const collectionOptions = options.collections?.find((c) => c.name === name);

    const overrides = collectionOptions
      ? makeSparse(collectionOptions)
      : undefined;

    const coll = createCmsCollection(
      { ...overrides, name, uploads, contentBasePath },
      collection,
    );

    collections.push(coll);
  }

  for (const [name, collection] of Object.entries(config.collections)) {
    const cmsCollection = collections.find((c) => c.name === name);
    if (!cmsCollection) {
      throw new Error(`Invalid collection name '${name}'`);
    }

    addCollectionFields(collection, cmsCollection, collections);
  }

  return collections;
}

const buildModes = ['local', 'development', 'production'] as const;
type BuildMode = (typeof buildModes)[number];
type BuildOptions = {
  folderPath: string;
  devUrl: string;
};

function getCmsConfig(
  context: {
    mode: BuildMode;
    build: BuildOptions;
    config: Config;
    collections: CmsCollection[];
  },
  options: Pick<Options, 'url' | 'repo' | 'cms'> & {
    uploads: UploadsOptions;
  },
) {
  const { mode, build, collections } = context;
  const { uploads, url, repo, cms } = options;

  const siteUrl = mode === 'production' ? new URL(url) : new URL(build.devUrl);

  const cmsConfig: CmsConfig = {
    site_url: siteUrl.toString(),
    backend: {
      name: repo.provider,
      repo: repo.name,
      branch: repo.branch,
      site_domain: siteUrl.host,
      base_url: siteUrl.origin,
      auth_endpoint: 'oauth',
    },
    local_backend: mode === 'local',
    publish_mode: 'simple',
    media_folder: uploads.folderPath,
    public_folder: uploads.baseUrl,
    show_preview_links: true,
    editor: {
      preview: true,
    },
    collections,
    automatic_deployments: true,
    omit_empty_optional_fields: true,
    json: {
      indent_style: 'space',
      indent_size: 2,
    },
    yaml: {
      quote: 'double',
      indent_size: 2,
    },
  };

  return merge(cmsConfig, cms ? makeSparse(cms) : undefined);
}

type GenerateCmsConfigOptions = Pick<
  Options,
  'url' | 'repo' | 'collections' | 'cms'
> & {
  uploads: UploadsOptions;
  build: BuildOptions;
};

export async function generateCmsConfig(
  config: Config,
  options: GenerateCmsConfigOptions,
) {
  const { build } = options;

  const collections = getCmsCollections({ config }, options);

  for (const mode of buildModes) {
    const cmsConfig = getCmsConfig(
      { mode, config, collections, build },
      options,
    );
    const filePath = join(build.folderPath, mode, 'config.json');

    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(cmsConfig, null, 2));
  }
}
