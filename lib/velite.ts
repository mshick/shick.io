import { fromZonedTime } from 'date-fns-tz'
import { basename } from 'node:path'
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
import { getContentPath } from './content'
import { getGitFileInfo } from './git'
import { GitFileInfo, Tag } from './types'

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

  return gitCache[filePath]
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

export function getTags(tags: string[]): Tag[] {
  return tags.map((tag) => {
    const tagSlug = slug(tag)
    return {
      name: tag,
      permalink: getContentPath('tags', tagSlug),
      slug: tagSlug
    }
  })
}

/**
 * Get the path within the collection
 */
export function getCollectionPath(collectionName: string, path: string) {
  return path.replace(`${collectionName}/`, '')
}

/**
 * Get the permalink path
 */
export function getPermalink(
  collectionName: string,
  path: string,
  slug?: string
) {
  let collectionPath = getCollectionPath(collectionName, path)

  if (slug) {
    collectionPath = collectionPath.replace(basename(collectionPath), slug)
  }

  return getContentPath(collectionName, collectionPath)
}
