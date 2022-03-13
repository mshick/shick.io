import type { ReadTimeResults } from 'reading-time'
import type { MDX } from 'contentlayer/core'
import readingTime from 'reading-time'
import { bundleMDX } from 'mdx-bundler'

export const sanitizeMdx = (content: string) =>
  content
    .replace(
      /^import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)$/gm,
      ''
    ) // Strip imports
    .replace(/!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g, '') // Remove markdown images
    .replace(/^#.*$/gm, '') // Remove headings if they show up this soon
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/<[^>]*>?/gm, '') // Strip HTML
    .replace(/^\s*\n/gm, '\n') // Strip lines with just spaces
    .trimStart()

export async function getExcerpt(content: string): Promise<MDX> {
  const excerpt = sanitizeMdx(content)
    .split('```', 1)[0] // Ignore anything after the first code block.
    .trimStart()
    .split(/\n\n/, 2) // Take first two paragraphs
    .join('\n\n')

  const mdx = await bundleMDX({ source: excerpt })

  return {
    raw: excerpt,
    code: mdx.code,
  }
}

const readingTimeCache = {}

export function getReadingTimeCached(
  filePath: string,
  content: string
): ReadTimeResults {
  if (!readingTimeCache[filePath]) {
    readingTimeCache[filePath] = readingTime(sanitizeMdx(content))
  }
  return readingTimeCache[filePath]
}
