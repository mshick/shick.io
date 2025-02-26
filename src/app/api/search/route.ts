import MiniSearch, { type SearchResult } from 'minisearch';
import { type NextRequest, NextResponse } from 'next/server';
import { searchFields, searchStoreBoost, searchStoreFields } from '~/lib/env';
import type { Document } from '#/content';
import searchIndexData from '#/generated/search/index.json';

type StoredDocument = Pick<Document, (typeof searchStoreFields)[number]>;

const miniSearch = MiniSearch.loadJSON<StoredDocument>(
  searchIndexData.searchIndex,
  {
    fields: [...searchFields],
    storeFields: [...searchStoreFields],
    searchOptions: {
      boost: searchStoreBoost,
      prefix: true,
    },
  },
);

export const runtime = 'edge';

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get('query');

  let data: SearchResult[] = [];

  if (query) {
    data = miniSearch.search(query);
  }

  return NextResponse.json(
    { data },
    {
      status: 200,
    },
  );
}
