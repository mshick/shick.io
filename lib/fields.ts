import { basename, dirname, join, relative, resolve } from 'node:path';
import { TZDate } from '@date-fns/tz';
import isEmpty from 'lodash/isEmpty.js';
import slug from 'slug';
import type { ZodMeta, z } from 'velite';
import { devUrl, isProduction } from './env';
import { excerptFn } from './excerpt';
import { type GitFileInfo, getGitFileInfo } from './git';
import { url, collections, repo, timezone } from './options';
import type { BaseCategory, BaseTag } from './schema';

const __dirname = import.meta.dirname;
const baseDir = resolve(__dirname, '..');

function getSiteUrl(): string {
  return isProduction && url ? url : devUrl;
}

function getRepoPath(filePath: string): string {
  return filePath.replace(`${baseDir}/`, '');
}

const gitCache: Record<string, GitFileInfo | null> = {};

export async function getUpdatedBy(
  filePath: string,
): Promise<GitFileInfo | null> {
  if (gitCache[filePath] === undefined) {
    gitCache[filePath] = (await getGitFileInfo(baseDir, filePath)) ?? null;
  }

  return gitCache[filePath] ?? null;
}

export function getZonedDate(date: string | Date): Date {
  // Some TS weirdness here
  if (typeof date === 'string') {
    return new TZDate(date, timezone);
  }

  return new TZDate(date, timezone);
}

export function getShareUrl(path: string): string {
  return new URL(path, getSiteUrl()).href;
}

function formatRepoUrl(action: 'commits' | 'edit', filePath: string) {
  return `https://github.com/${repo.name}/${action}/${repo.branch}/${filePath}`;
}

export function getHistoryUrl(filePath: string): string {
  return formatRepoUrl('commits', getRepoPath(filePath));
}

export function getEditUrl(filePath: string): string {
  return formatRepoUrl('edit', getRepoPath(filePath));
}

function stripIndex(path: string) {
  if (path.endsWith('/index')) {
    return dirname(path);
  }

  if (path === 'index') {
    return '';
  }

  return path;
}

const collectionPaths: Record<string, string> | undefined = collections?.reduce(
  (p, v) => (v.path ? Object.assign(p, { [v.name]: v.path }) : p),
  {},
);

export function getCollectionBasePath(collectionName: string) {
  return collectionPaths?.[collectionName] ?? `/${collectionName}`;
}

/**
 * Get the permalink path
 */
export function getPermalink(
  collectionName: string,
  path: string,
  customSlug?: string,
) {
  const basePath = getCollectionBasePath(collectionName);
  const slugPath = isEmpty(customSlug)
    ? getSlugFromPath(collectionName, path)
    : customSlug!;
  const joinedPath = join(basePath, stripIndex(slugPath));
  // Enforce trailing slash
  // TODO Match next config settings
  return joinedPath.endsWith('/') ? joinedPath : joinedPath.concat('/');
}

/**
 * Gets the relative path within the content directory
 *
 * @example https://github.com/zce/velite/blob/main/src/schemas/path.ts
 */
export function getContentPath(root: string, path: string) {
  return relative(root, path)
    .replace(/\.[^.]+$/, '')
    .replace(/\\/g, '/');
}

/**
 * Gets a slug from a path inside the content folder
 *
 * @example
 * post/foo.md -> post/foo -> foo
 * post/bar/index.md -> post/bar/index -> blah
 * post/baz/bam.md -> post/baz/bam -> baz/bam
 */
export function getSlugFromPath(
  collectionName: string,
  contentPath: string,
  userSlug?: string,
) {
  // post/foo -> foo
  // post/bar/index.md -> bar
  // post/baz/bam.md -> baz/bam
  const nakedPath = contentPath
    .replace(`${collectionName}/`, '')
    .replace(/\/$/, '');

  // foo -> foo
  // bar -> bar
  // baz/bam -> bam
  let slugPath = nakedPath;

  if (!isEmpty(userSlug)) {
    slugPath = nakedPath.replace(basename(nakedPath), userSlug!);
  }

  return slugPath;
}

/**
 * Gets a slug from a valid name (a name is not a path)
 */
export function getSlug(name: string) {
  if (name.search('/') !== -1) {
    throw new Error('slug source cannot contain `/`');
  }

  return slug(name);
}

export function getAvailable(item: { draft: boolean }) {
  return process.env.NODE_ENV !== 'production' || !item.draft;
}

type TransformCtx = {
  addIssue?: z.RefinementCtx['addIssue'];
  path: (string | number)[];
  meta: Pick<ZodMeta, 'content' | 'path'> & {
    config: Pick<ZodMeta['config'], 'root'>;
  };
};

export function createTaxonomyTransform(taxonomyName: string) {
  return async (data: BaseTag | BaseCategory, ctx: TransformCtx) => {
    const { meta } = ctx;
    const updatedBy = await getUpdatedBy(meta.path);
    const path = getContentPath(meta.config.root, meta.path);
    const slug = getSlugFromPath(taxonomyName, path);
    const permalink = getPermalink(taxonomyName, path, slug);
    const excerpt = data.excerpt ?? `${data.name} ${taxonomyName}.`;
    return {
      ...data,
      body: isEmpty(data.body)
        ? excerptFn({ format: 'html' }, excerpt, ctx)
        : data.body,
      excerpt: excerptFn({ format: 'text' }, excerpt, ctx),
      excerptHtml: excerptFn({ format: 'html' }, excerpt, ctx),
      slug,
      permalink,
      publishedAt: getZonedDate(
        data.date ?? updatedBy?.latestDate ?? new Date(),
      ).toISOString(),
      updatedAt: getZonedDate(
        updatedBy?.latestDate ?? new Date(),
      ).toISOString(),
    };
  };
}

export async function getTaxonomy(
  root: string,
  collectionName: string,
  terms?: string[],
) {
  if (!terms) {
    return;
  }

  const transform = createTaxonomyTransform(collectionName);
  return Promise.all(
    terms.map((term) => {
      return transform(
        {
          name: term,
          body: '',
          count: {
            total: 0,
            post: 0,
            page: 0,
          },
        },
        {
          path: [],
          meta: {
            content: '',
            path: `${root}/${collectionName}/${getSlug(term.replaceAll('/', '_'))}`,
            config: {
              root,
            },
          },
        },
      );
    }),
  );
}
