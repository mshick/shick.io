#!/usr/bin/env node

import { writeFileSync } from 'fs'
import MiniSearch from 'minisearch'
import { allDocuments } from '../.contentlayer/generated/index.mjs'

function generate() {
  const docs = allDocuments.map((doc) => ({
    id: doc._id,
    title: doc.title,
    body: doc.body.raw,
    excerpt: doc.excerpt,
    path: doc.path,
    tags: doc.tags.map((tag) => tag.name),
    publishedAt: doc.publishedAt
  }))

  const miniSearch = new MiniSearch({
    fields: ['title', 'body', 'excerpt', 'tags'],
    storeFields: ['title', 'excerpt', 'path', 'publishedAt']
  })

  miniSearch.addAll(docs)

  writeFileSync(
    './src/generated/searchIndex.json',
    // Double-stringify the index, a string is required for import
    JSON.stringify({ index: JSON.stringify(miniSearch) })
  )
}

generate()
