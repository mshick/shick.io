import type { ReadTimeResults } from 'reading-time'
import type { LocalDocument } from 'contentlayer/source-files'
import type { Transformer } from 'unified'
import readingTime from 'reading-time'
import { remark } from 'remark'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import remarkUnlink from 'remark-unlink'
import remarkMdx from 'remark-mdx'
import remarkMdxRemoveImports from 'remark-mdx-remove-imports'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import { remove } from 'unist-util-remove'

function remarkTruncate(): Transformer {
  return function transformer(tree) {
    let paragraphCount = 0

    const filter = (node, _depth, parent) => {
      if (node.type === 'root') {
        return false
      }

      if (node.type === 'heading') {
        return true
      }

      if (
        parent?.type === 'root' &&
        node.type === 'paragraph' &&
        paragraphCount < 2
      ) {
        paragraphCount += 1
      }

      if (
        parent?.type === 'root' &&
        (node.type !== 'paragraph' || paragraphCount >= 2)
      ) {
        return true
      }

      return false
    }
    return remove(tree, { cascade: false }, filter)
  }
}

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

export function getReadingTimeCached(doc: LocalDocument): ReadTimeResults {
  if (!readingTimeCache[doc._id]) {
    readingTimeCache[doc._id] = readingTime(doc.body.raw)
  }
  return readingTimeCache[doc._id]
}
