import { SetStateAction } from 'jotai'
import MiniSearch, { SearchOptions, SearchResult } from 'minisearch'
import { Dispatch, useEffect, useRef, useState } from 'react'

export type IndexedResult = {
  id: string
  title: string
  path: string
  excerpt: string
  publishedAt: string
}

export type MiniSearchResult = SearchResult & IndexedResult

export type UseMiniSearchProps = {
  searchOptions?: SearchOptions
}

export type MiniSearchHookResults = {
  isLoading: boolean
  isReady: boolean
  query: string
  results: MiniSearchResult[]
}

export function useMiniSearch({ searchOptions }: UseMiniSearchProps = {}): [
  Dispatch<SetStateAction<string>>,
  MiniSearchHookResults
] {
  searchOptions = searchOptions ?? {
    boost: {
      title: 2,
      tags: 2,
      excerpt: 1.5
    },
    prefix: true
  }

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const minisearch = useRef<MiniSearch>(null)

  useEffect(() => {
    async function loadSearchIndex() {
      // @ts-ignore Generated file, may not be present during typechecking
      const { index } = await import('../generated/searchIndex.json')
      minisearch.current = MiniSearch.loadJSON<IndexedResult>(index, {
        fields: ['title', 'tags', 'excerpt', 'body'],
        storeFields: ['title', 'excerpt', 'path', 'publishedAt'],
        searchOptions
      })
      setIsReady(true)
    }

    if (!isReady) {
      loadSearchIndex()
    }
  }, [isReady, searchOptions])

  useEffect(() => {
    async function search() {
      setIsLoading(true)
      const results = minisearch.current.search(query)
      setResults(results)
      setIsLoading(false)
    }

    if (isReady && query?.length > 1) {
      search()
    }
  }, [isReady, query])

  useEffect(() => {
    if (query.length === 0) {
      setResults([])
    }
  }, [query])

  return [setQuery, { isLoading, isReady, query, results }]
}
