import { Image } from 'contentlayer/generated'
import { LocalDocument } from 'contentlayer2/source-files'
import { fromZonedTime } from 'date-fns-tz'
import { get } from 'lodash-es'
import { createHash } from 'node:crypto'
import { copyFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { format } from 'node:util'
import readingTime, { ReadTimeResults } from 'reading-time'
import slug from 'slug'
import {
  baseDir,
  canonicalUrl,
  contentDirPath,
  editUrlPattern,
  isProduction,
  localDevUrl,
  timezone,
  vercelUrl
} from '../env'
import { remarkExcerpt } from '../lib/remark-excerpt'
import { getContentPath } from './content'
import { getGitFileInfo } from './git'
import { remarkTruncate } from './remark-truncate'
import { GitFileInfo, Tag, isImageFieldData } from './types'

export async function convertExcerpt(excerpt: string) {
  const html = await remarkExcerpt(excerpt)
  return String(html)
}

export async function truncateBody(body: string) {
  const html = await remarkTruncate(body)
  return String(html)
}

export function getSiteUrl(): string {
  return isProduction ? canonicalUrl ?? '' : vercelUrl ?? localDevUrl
}

export async function getExcerpt(doc: LocalDocument): Promise<string> {
  return await (doc.excerpt
    ? convertExcerpt(`${doc.excerpt}\n\n`)
    : truncateBody(doc.body.raw))
}

const readingTimeCache: Record<string, ReadTimeResults> = {}

export function getReadingTime(doc: LocalDocument): ReadTimeResults {
  if (!readingTimeCache[doc._id]) {
    readingTimeCache[doc._id] = readingTime(doc.body.raw)
  }
  return readingTimeCache[doc._id]
}

const gitCache: Record<string, GitFileInfo> = {}

export async function getUpdatedBy(doc: LocalDocument): Promise<string> {
  if (!gitCache[doc._id]) {
    gitCache[doc._id] = await getGitFileInfo(
      baseDir,
      path.join(contentDirPath, doc._raw.sourceFilePath)
    )
  }
  return gitCache[doc._id].latestAuthorName
}

export async function getUpdatedByEmail(doc: LocalDocument): Promise<string> {
  if (!gitCache[doc._id]) {
    gitCache[doc._id] = await getGitFileInfo(
      baseDir,
      path.join(contentDirPath, doc._raw.sourceFilePath)
    )
  }
  return gitCache[doc._id].latestAuthorEmail
}

export async function getUpdatedAt(doc: LocalDocument): Promise<string> {
  if (!gitCache[doc._id]) {
    gitCache[doc._id] = await getGitFileInfo(
      baseDir,
      path.join(contentDirPath, doc._raw.sourceFilePath)
    )
  }

  const { latestDate } = gitCache[doc._id]

  const date = doc.updatedAt
    ? fromZonedTime(doc.updatedAt, timezone)
    : latestDate
      ? new Date(latestDate)
      : null

  return date ? date.toISOString() : new Date().toISOString()
}

export function getPublishedAt(doc: LocalDocument): string {
  return doc.publishedAt
    ? fromZonedTime(doc.publishedAt, timezone).toISOString()
    : ''
}

export function getSlug(doc: LocalDocument): string {
  const fileName = doc._raw.sourceFileName.replace(/\.mdx?/, '')
  return slug(fileName)
}

export function getPath(doc: LocalDocument): string {
  const fileDir = doc._raw.sourceFileDir.split('/')[0]
  return getContentPath(fileDir, getSlug(doc))
}

export function getTags(doc: LocalDocument): Tag[] {
  const tags: string[] = doc.tags?.array() ?? []
  return tags.map((tag) => {
    const tagSlug = slug(tag, { replacement: '_' })
    return {
      name: tag,
      path: getContentPath('tags', tagSlug),
      slug: tagSlug
    }
  })
}

export function getEditUrl(doc: LocalDocument): string {
  const { sourceFilePath } = doc._raw
  return editUrlPattern
    ? format(editUrlPattern, `${contentDirPath}/${sourceFilePath}`)
    : ''
}

export function getShareUrl(doc: LocalDocument): string {
  return new URL(getPath(doc), getSiteUrl()).href
}

async function getFileHash(filePath: string): Promise<string> {
  const fileBuffer = await readFile(filePath)
  const hashSum = createHash('sha256')
  hashSum.update(fileBuffer)
  return hashSum.digest('hex').slice(0, 8).toUpperCase()
}

export function copyAssetAndGetUrl(fieldName: string) {
  return async (doc: LocalDocument): Promise<string | null> => {
    const asset = get<Image['asset']>(doc, fieldName as any)

    if (!isImageFieldData(asset)) {
      return null
    }

    const { filePath } = asset
    const imgPath = 'images'

    const srcPath = path.join(baseDir, contentDirPath, filePath)

    const fileHash = await getFileHash(srcPath)
    const extName = path.extname(filePath)
    const baseName = path.basename(filePath, extName)
    const dstFileName = `${baseName}~${fileHash}${extName}`

    const dstPath = path.join(baseDir, 'public', imgPath, dstFileName)

    await copyFile(srcPath, dstPath)
    return `/${imgPath}/${dstFileName}`
  }
}
