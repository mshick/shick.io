import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import pick from 'lodash/pick.js';
import MiniSearch from 'minisearch';
import { searchFields, searchStoreFields } from './env';
import type { Page, Post } from './schema';

const documentFields = [...new Set([...searchFields, ...searchStoreFields])];

export async function generateSearchIndex(
  docs: (Page | Post)[],
  { filePath }: { filePath: string },
) {
  const searchDocs = docs.map((doc) => ({
    id: doc.permalink,
    ...pick(doc, documentFields),
  }));

  const miniSearch = new MiniSearch({
    fields: [...searchFields],
    storeFields: [...searchStoreFields],
  });

  miniSearch.addAll(searchDocs);

  await mkdir(dirname(filePath), { recursive: true });

  await writeFile(
    filePath,
    // Double-stringify the index, a string is required for import
    JSON.stringify({ searchIndex: JSON.stringify(miniSearch) }),
  );

  return {
    documentCount: miniSearch.documentCount,
    termCount: miniSearch.termCount,
  };
}
