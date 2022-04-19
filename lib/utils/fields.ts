import type { LocalDocument } from 'contentlayer/source-files'
import dateFns from 'date-fns-tz'
import path from 'path'
import type { ReadTimeResults } from 'reading-time'
import readingTime from 'reading-time'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkMdx from 'remark-mdx'
import remarkMdxRemoveImports from 'remark-mdx-remove-imports'
import remarkParse from 'remark-parse'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import remarkUnlink from 'remark-unlink'
import slug from 'slug'
import { baseDir, contentDir, timezone } from '../config'
import remarkTruncate from '../remark/remark-truncate'
import type { Tag } from '../types'
import { getContentPath } from './content'
import { getGitInfo } from './git'

const { zonedTimeToUtc } = dateFns

export async function convertExcerpt(excerpt: string) {
  const html = await remark().use(remarkParse).use(remarkHtml).process(excerpt)
  return String(html)
}

export async function truncateBody(body: string) {
  const html = await remark()
    .use(remarkMdx)
    .use(remarkMdxRemoveImports)
    .use(remarkUnlink)
    .use(remarkSqueezeParagraphs)
    .use(remarkTruncate)
    .use(remarkHtml)
    .process(body)
  return String(html)
}

export async function getExcerpt(doc: LocalDocument): Promise<string> {
  return await (doc.excerpt
    ? convertExcerpt(`${doc.excerpt}\n\n`)
    : truncateBody(doc.body.raw))
}

const readingTimeCache = {}

export function getReadingTime(doc: LocalDocument): ReadTimeResults {
  if (!readingTimeCache[doc._id]) {
    readingTimeCache[doc._id] = readingTime(doc.body.raw)
  }
  return readingTimeCache[doc._id]
}

const gitInfoCache = {}

export async function getUpdatedBy(doc: LocalDocument): Promise<string> {
  if (!gitInfoCache[doc._id]) {
    gitInfoCache[doc._id] = await getGitInfo(
      baseDir,
      path.join(contentDir, doc._raw.sourceFilePath)
    )
  }
  return gitInfoCache[doc._id].latestAuthorName
}

export async function getUpdatedByEmail(doc: LocalDocument): Promise<string> {
  if (!gitInfoCache[doc._id]) {
    gitInfoCache[doc._id] = await getGitInfo(
      baseDir,
      path.join(contentDir, doc._raw.sourceFilePath)
    )
  }
  return gitInfoCache[doc._id].latestAuthorEmail
}

export async function getUpdatedAt(doc: LocalDocument): Promise<string> {
  if (!gitInfoCache[doc._id]) {
    gitInfoCache[doc._id] = await getGitInfo(
      baseDir,
      path.join(contentDir, doc._raw.sourceFilePath)
    )
  }

  const { latestDate } = gitInfoCache[doc._id]

  const date = doc.updatedAt
    ? zonedTimeToUtc(doc.updatedAt, timezone)
    : latestDate
    ? new Date(latestDate)
    : null

  return date ? date.toISOString() : new Date().toISOString()
}

export function getPublishedAt(doc: LocalDocument): string {
  return doc.publishedAt
    ? zonedTimeToUtc(doc.publishedAt, timezone).toISOString()
    : ''
}

export function getSlug(doc: LocalDocument): string {
  return slug(doc._raw.sourceFileName.replace(/\.mdx/, ''))
}

export function getPath(doc: LocalDocument): string {
  const { sourceFileDir } = doc._raw
  return getContentPath(sourceFileDir, getSlug(doc))
}

export function getTags(doc: LocalDocument): Tag[] {
  const tags: string[] = doc.tags?.array() ?? []
  return tags.map((tag) => {
    const tagSlug = slug(tag)
    return {
      name: tag,
      path: getContentPath('tags', tagSlug),
      slug: tagSlug
    }
  })
}
