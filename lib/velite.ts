import { fromZonedTime } from 'date-fns-tz'
import { basename, join, relative } from 'node:path'
import { format } from 'node:util'
import slug from 'slug'
import {
  baseDir,
  canonicalUrl,
  editUrlPattern,
  isProduction,
  localDevUrl,
  timezone,
  vercelUrl
} from '../env'
import { getGitFileInfo } from './git'
import { GitFileInfo } from './types'

function getSiteUrl(): string {
  return isProduction ? canonicalUrl ?? '' : vercelUrl ?? localDevUrl
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
  return fromZonedTime(date, timezone)
}

export function getShareUrl(path: string): string {
  return new URL(path, getSiteUrl()).href
}

export function getEditUrl(filePath: string): string {
  return editUrlPattern ? format(editUrlPattern, getRepoPath(filePath)) : ''
}

export function getTaxonomy(collectionName: string, terms: string[]) {
  return terms.map((term) => {
    const termSlug = getSlug(term.replaceAll('/', '_'))
    return {
      name: term,
      permalink: getPermalink(collectionName, termSlug),
      slug: termSlug,
      count: {
        total: 0,
        posts: 0
      }
    }
  })
}

/**
 * Get the permalink path
 */
export function getPermalink(
  collectionName: string,
  path: string,
  slug = getSlugFromPath(path),
  basePath = `/${collectionName}`
) {
  const slugPath = path
    .replace(`${collectionName}/`, '')
    .replace(basename(path), slug)

  return join(basePath, slugPath).replace(/\/index$/, '/')
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
 * Gets a slug from a path, using only the basename
 */
export function getSlugFromPath(path: string) {
  return slug(basename(path))
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

export function getAvailable(item: { draft: boolean; private: boolean }) {
  return process.env.NODE_ENV !== 'production' || (!item.draft && !item.private)
}
