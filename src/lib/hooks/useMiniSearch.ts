import { searchFields, searchStoreFields } from '@/env'
import MiniSearch, { SearchOptions, SearchResult } from 'minisearch'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

export type IndexedResult = {
  title: string
  permalink: string
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
  const [results, setResults] = useState<MiniSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const minisearch = useRef<MiniSearch>()

  useEffect(() => {
    async function loadSearchIndex() {
      const { index } = await import('../../generated/search/index.json')
      minisearch.current = MiniSearch.loadJSON<IndexedResult>(index, {
        fields: searchFields,
        storeFields: searchStoreFields,
        searchOptions
      })
      setIsReady(true)
    }

    if (!isReady) {
      void loadSearchIndex()
    }
  }, [isReady, searchOptions])

  useEffect(() => {
    function search() {
      setIsLoading(true)
      if (minisearch.current) {
        const results = minisearch.current.search(query) as MiniSearchResult[]
        setResults(results)
      }
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
