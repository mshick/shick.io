import { getAvailable, getTaxonomy } from './fields'

type Taxonomy = {
  name: string
  count: {
    posts: number
    pages: number
    total: number
  }
}

type Document = {
  draft: boolean
  categories: string[]
  tags: string[]
}

type Collections = {
  categories: Taxonomy[]
  tags: Taxonomy[]
  posts: Document[]
  pages: Document[]
}

export async function prepareTaxonomy(collections: Collections) {
  const { categories, tags, posts, pages } = collections

  const docs = [...posts.filter(getAvailable), ...pages.filter(getAvailable)]

  const categoriesInDocs = new Set(docs.map((item) => item.categories).flat())

  const categoriesFromDocs = await getTaxonomy(
    'content',
    'categories',
    Array.from(categoriesInDocs).filter(
      (i) => categories.find((j) => j.name === i) == null
    )
  )

  categories.push(...categoriesFromDocs)

  categories.forEach((i) => {
    i.count.posts = posts.filter((j) => j.categories.includes(i.name)).length
    i.count.pages = pages.filter((j) => j.categories.includes(i.name)).length
    i.count.total = i.count.posts + i.count.pages
  })

  const tagsInDocs = new Set(docs.map((item) => item.tags).flat())

  const tagsFromDocs = await getTaxonomy(
    'content',
    'tags',
    Array.from(tagsInDocs).filter((i) => tags.find((j) => j.name === i) == null)
  )

  tags.push(...tagsFromDocs)

  tags.forEach((i) => {
    i.count.posts = posts.filter((j) => j.tags.includes(i.name)).length
    i.count.pages = pages.filter((j) => j.tags.includes(i.name)).length
    i.count.total = i.count.posts + i.count.pages
  })

  return {
    tagCount: tags.length,
    categoryCount: categories.length
  }
}
