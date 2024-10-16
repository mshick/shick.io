import { type Document } from '#/content'
import { index } from '#/generated/search/index.json'
import { searchFields, searchStoreBoost, searchStoreFields } from '@/env'
import MiniSearch, { type SearchResult } from 'minisearch'
import { type NextRequest, NextResponse } from 'next/server'

type StoredDocument = Pick<Document, (typeof searchStoreFields)[number]>

const miniSearch = MiniSearch.loadJSON<StoredDocument>(index, {
  fields: [...searchFields],
  storeFields: [...searchStoreFields],
  searchOptions: {
    boost: searchStoreBoost,
    prefix: true
  }
})

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const query = searchParams.get('query')

  let data: SearchResult[] = []

  if (query) {
    data = miniSearch.search(query)
  }

  return NextResponse.json(
    { data },
    {
      status: 200
    }
  )
}
