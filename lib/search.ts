import pick from 'lodash/pick.js'
import MiniSearch from 'minisearch'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { searchFields, searchStoreFields } from './env'

const documentFields = [
  'permalink',
  'title',
  'excerpt',
  'content',
  'tags',
  'categories',
  'publishedAt'
]

type Document = {
  permalink: string
  title: string
  excerpt?: string
  content?: string
  publishedAt: string
  tags: string[]
  categories: string[]
}

export async function generateSearchIndex(
  docs: Document[],
  { filePath }: { filePath: string }
) {
  const searchDocs = docs.map((doc) => ({
    id: doc.permalink,
    ...pick(doc, documentFields)
  }))

  const miniSearch = new MiniSearch({
    fields: searchFields,
    storeFields: searchStoreFields
  })

  miniSearch.addAll(searchDocs)

  await mkdir(dirname(filePath), { recursive: true })

  await writeFile(
    filePath,
    // Double-stringify the index, a string is required for import
    JSON.stringify({ index: JSON.stringify(miniSearch) })
  )

  return {
    documentCount: miniSearch.documentCount,
    termCount: miniSearch.termCount
  }
}
