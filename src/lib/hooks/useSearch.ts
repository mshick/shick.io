'use client';

import type { SearchResult } from 'minisearch';
import { type Dispatch, type SetStateAction, useState } from 'react';
import useSWR, { type Fetcher } from 'swr';
import type { searchStoreFields } from '~/lib/env';
import type { Document } from '#/content';
import { FetchError } from '../errors';

type SearchDocument = Pick<Document, (typeof searchStoreFields)[number]> &
  SearchResult;

const fetcher: Fetcher<SearchDocument[], string> = (query) =>
  fetch(`/api/search?query=${query}`)
    .then((res) => Promise.all([res, res.json()]))
    .then(([res, body]) => {
      if (!res.ok) {
        throw new FetchError('An error occurred while fetching the data.', {
          info: body,
          status: res.status,
        });
      }

      return body.data;
    });

export type SearchHookResults<T> = {
  isLoading: boolean;
  query: string;
  results: T[];
};

export function useSearch(): [
  Dispatch<SetStateAction<string>>,
  SearchHookResults<SearchDocument>,
] {
  const [query, setQuery] = useState('');

  const { data: results, isLoading } = useSWR(
    () => (query.length > 1 ? query : null),
    fetcher,
    { fallbackData: [] },
  );

  return [setQuery, { isLoading, query, results }];
}
