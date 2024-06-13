#!/usr/bin/env -S npx tsx

import { getPages, getPosts } from 'lib/helper.js'
import MiniSearch from 'minisearch'
import { mkdirSync, writeFileSync } from 'node:fs'

function main() {
  const posts = getPosts([
    'permalink',
    'title',
    'excerpt',
    'content',
    'tags',
    'publishedAt'
  ])

  const pages = getPages([
    'permalink',
    'title',
    'excerpt',
    'content',
    'tags',
    'publishedAt'
  ])

  const docs = [...posts, ...pages].map((doc) => ({
    id: doc.permalink,
    permalink: doc.permalink,
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
    tags: doc.tags,
    publishedAt: doc.publishedAt
  }))

  const miniSearch = new MiniSearch({
    fields: ['title', 'content', 'excerpt', 'tags'],
    storeFields: ['title', 'excerpt', 'permalink', 'publishedAt']
  })

  miniSearch.addAll(docs)

  mkdirSync('./src/generated/search', { recursive: true })

  writeFileSync(
    './src/generated/search/index.json',
    // Double-stringify the index, a string is required for import
    JSON.stringify({ index: JSON.stringify(miniSearch) })
  )
}

main()
