'use client';

import MiniSearch, { type SearchOptions, type SearchResult } from 'minisearch';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { searchFields } from '~/lib/env';
import type { Document } from '#/content';

export type MiniSearchResult = SearchResult;

export type MiniSearchHookResults<T> = {
  isLoading: boolean;
  isReady: boolean;
  query: string;
  results: (SearchResult & T)[];
};

export function useMiniSearch<
  F extends keyof Document,
  StoredDocument = Pick<Document, F>,
>(
  searchStoreFields: F[],
  searchOptions: SearchOptions,
): [Dispatch<SetStateAction<string>>, MiniSearchHookResults<StoredDocument>] {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(SearchResult & StoredDocument)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const minisearch = useRef<MiniSearch<StoredDocument>>();

  useEffect(() => {
    async function loadSearchIndex() {
      const searchIndexData = (await import(
        '../../generated/search/index.json'
      )) as {
        searchIndex: string;
      };
      minisearch.current = MiniSearch.loadJSON<StoredDocument>(
        searchIndexData.searchIndex,
        {
          fields: [...searchFields],
          storeFields: [...searchStoreFields],
          searchOptions,
        },
      );
      setIsReady(true);
    }

    if (!isReady) {
      void loadSearchIndex();
    }
  }, [isReady, searchOptions, searchStoreFields]);

  useEffect(() => {
    function search() {
      setIsLoading(true);
      if (minisearch.current) {
        const results = minisearch.current.search(query);
        setResults(results as (SearchResult & StoredDocument)[]);
      }
      setIsLoading(false);
    }

    if (isReady && query?.length > 1) {
      search();
    }
  }, [isReady, query]);

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
    }
  }, [query]);

  return [setQuery, { isLoading, isReady, query, results }];
}
