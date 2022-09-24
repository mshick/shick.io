#!/usr/bin/env node

import MiniSearch from 'minisearch'
import { mkdirSync, writeFileSync } from 'node:fs'
import {
  allArticles,
  allPages,
  allProjects
} from '../.contentlayer/generated/index.mjs'

function generate() {
  const docs = [...allArticles, ...allPages, ...allProjects].map((doc) => ({
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

  mkdirSync('./src/generated', { recursive: true })

  writeFileSync(
    './src/generated/searchIndex.json',
    // Double-stringify the index, a string is required for import
    JSON.stringify({ index: JSON.stringify(miniSearch) })
  )
}

generate()
