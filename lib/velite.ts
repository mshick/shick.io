import { fromZonedTime } from 'date-fns-tz'
import { basename, join, relative } from 'node:path'
import { format } from 'node:util'
import slug from 'slug'
import { z } from 'velite'
import {
  baseDir,
  canonicalUrl,
  editUrlPattern,
  isProduction,
  localDevUrl,
  timezone,
  vercelUrl
} from '../env'
import { excerptFn } from './excerpt'
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
    const slug = data.slug ?? getSlugFromPath(path)
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
