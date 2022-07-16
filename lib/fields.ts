import { LocalDocument } from 'contentlayer/source-files'
import dateFns from 'date-fns-tz'
import path from 'path'
import readingTime, { ReadTimeResults } from 'reading-time'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkMdx from 'remark-mdx'
import remarkMdxRemoveImports from 'remark-mdx-remove-imports'
import remarkParse from 'remark-parse'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import remarkUnlink from 'remark-unlink'
import slug from 'slug'
import {
  baseDir,
  canonicalUrl,
  contentDirPath,
  defaultBranch,
  githubRepo,
  isProduction,
  localDevUrl,
  timezone,
  vercelUrl
} from '../env'
import remarkTruncate from '../lib/remark/remark-truncate'
import { getContentPath } from './content'
import { getGitFileInfo } from './git'
import { Tag } from './types'

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

export function getSiteUrl(): string {
  return isProduction ? canonicalUrl : vercelUrl ?? localDevUrl
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

const gitCache = {
  __config: null
}

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
  // TODO Unfortunate logic, until we can set a bundler cwd per mdx file
  // const fileName = doc._raw.sourceFileName.split('__')
  // return slug((fileName[1] ?? fileName[0]).replace(/\.mdx?/, ''))
  const fileName = doc._raw.sourceFileName.replace(/\.mdx?/, '')
  return slug(fileName)
}

export function getPath(doc: LocalDocument): string {
  // TODO Unfortunate logic, until we can set a bundler cwd per mdx file
  // const fileName = doc._raw.sourceFileName.split('__')
  // const contentDir =
  //   fileName.length === 2 && fileName[0] !== 'pages' ? fileName[0] : ''
  // return getContentPath(contentDir, getSlug(doc))
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

export async function getEditUrl(doc: LocalDocument): Promise<string> {
  const { sourceFilePath } = doc._raw
  return `https://github.com/${githubRepo}/edit/${defaultBranch}/${contentDirPath}/${sourceFilePath}`
}

export function getShareUrl(doc: LocalDocument): string {
  return new URL(getPath(doc), getSiteUrl()).href
}
