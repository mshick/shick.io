import { TZDate } from '@date-fns/tz'
import { basename, join, relative, resolve } from 'node:path'
import { format } from 'node:util'
import slug from 'slug'
import { type z } from 'velite'
import { devUrl, isProduction } from './env'
import { excerptFn } from './excerpt'
import { getGitFileInfo, type GitFileInfo } from './git'
import { collectionPaths, repoUrlPattern, timezone, url } from './options'

const __dirname = import.meta.dirname
const baseDir = resolve(__dirname, '..')

function getSiteUrl(): string {
  return isProduction && url ? url : devUrl
}

function getRepoPath(filePath: string): string {
  return filePath.replace(`${baseDir}/`, '')
}

const gitCache: Record<string, GitFileInfo | null> = {}

export async function getUpdatedBy(
  filePath: string
): Promise<GitFileInfo | null> {
  if (gitCache[filePath] === undefined) {
    gitCache[filePath] = (await getGitFileInfo(baseDir, filePath)) ?? null
  }

  return gitCache[filePath] ?? null
}

export function getZonedDate(date: string | Date): Date {
  // Some TS weirdness here
  if (typeof date === 'string') {
    return new TZDate(date, timezone)
  }

  return new TZDate(date, timezone)
}

export function getShareUrl(path: string): string {
  return new URL(path, getSiteUrl()).href
}

export function getHistoryUrl(filePath: string): string {
  return repoUrlPattern
    ? format(repoUrlPattern, 'commits', getRepoPath(filePath))
    : ''
}

export function getEditUrl(filePath: string): string {
  return repoUrlPattern
    ? format(repoUrlPattern, 'edit', getRepoPath(filePath))
    : ''
}

/**
 * Get the permalink path
 */
export function getPermalink(
  collectionName: string,
  path: string,
  customSlug?: string
) {
  const basePath = collectionPaths?.[collectionName] ?? `/${collectionName}`
  const slugPath = customSlug ?? getSlugFromPath(collectionName, path)
  // Enforce trailing slash
  return join(basePath, slugPath).concat('/')
}

/**
 * Gets the relative path within the content directory
 *
 * @example https://github.com/zce/velite/blob/main/src/schemas/path.ts
 */
export function getContentPath(root: string, path: string) {
  return relative(root, path)
    .replace(/\.[^.]+$/, '')
    .replace(/\\/g, '/')
}

/**
 * Gets a slug from a path inside the content folder
 *
 * @example
 * posts/foo.md -> posts/foo -> foo
 * posts/bar/index.md -> posts/bar/index -> blah
 * posts/baz/bam.md -> posts/baz/bam -> baz/bam
 */
export function getSlugFromPath(
  collectionName: string,
  contentPath: string,
  userSlug?: string
) {
  // posts/foo -> foo
  // posts/bar/index.md -> bar
  // posts/baz/bam.md -> baz/bam
  const nakedPath = contentPath
    .replace(`${collectionName}/`, '')
    .replace(/\/index$/, '')

  // foo -> foo
  // bar -> bar
  // baz/bam -> bam
  const slugPath = nakedPath.replace(
    basename(nakedPath),
    userSlug ?? basename(nakedPath)
  )

  return slugPath
}

/**
 * Gets a slug from a valid name (a name is not a path)
 */
export function getSlug(name: string) {
  if (name.search('/') !== -1) {
    throw new Error('slug source cannot contain `/`')
  }

  return slug(name)
}

export function getAvailable(item: { draft: boolean }) {
  return process.env.NODE_ENV !== 'production' || !item.draft
}

type TaxonomyData = {
  [key: string]: unknown
  name: string
  count: {
    total: number
    posts: number
    pages: number
  }
  slug?: string
  content?: string
  excerpt?: string
  date?: string
}

type TaxonomyCtx = {
  addIssue?: (arg: z.IssueData) => void
  meta: {
    content?: string
    path: string
    config: {
      root: string
    }
  }
}

export function createTaxonomyTransform(taxonomyName: string) {
  return async (data: TaxonomyData, ctx: TaxonomyCtx) => {
    const { meta } = ctx
    const updatedBy = await getUpdatedBy(meta.path)
    const path = getContentPath(meta.config.root, meta.path)
    const slug = getSlugFromPath(taxonomyName, path, data.slug)
    const excerpt = data.excerpt ?? `${data.name} ${taxonomyName}.`
    return {
      ...data,
      content: data.content ?? excerptFn({ format: 'html' }, excerpt, ctx),
      excerpt: excerptFn({ format: 'text' }, excerpt, ctx),
      excerptHtml: excerptFn({ format: 'html' }, excerpt, ctx),
      slug,
      permalink: getPermalink(taxonomyName, path, slug),
      publishedAt: getZonedDate(
        data.date ?? updatedBy?.latestDate ?? new Date()
      ).toISOString(),
      updatedAt: getZonedDate(updatedBy?.latestDate ?? new Date()).toISOString()
    }
  }
}

export async function getTaxonomy(
  root: string,
  collectionName: string,
  terms: string[]
) {
  const transform = createTaxonomyTransform(collectionName)
  return Promise.all(
    terms.map((term) => {
      const termSlug = getSlug(term.replaceAll('/', '_'))
      return transform(
        {
          name: term,
          slug: termSlug,
          count: {
            total: 0,
            posts: 0,
            pages: 0
          }
        },
        {
          meta: {
            path: `${collectionName}/${termSlug}`,
            config: {
              root
            }
          }
        }
      )
    })
  )
}
