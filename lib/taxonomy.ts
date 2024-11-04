import { getAvailable, getTaxonomy } from './fields'
import { Category, Page, Post, Tag } from './schema'

type Collections = {
  categories: Category[]
  tags: Tag[]
  posts: Post[]
  pages: Page[]
}

export async function prepareTaxonomy(collections: Collections) {
  const { categories, tags, posts, pages } = collections

  const docs = [...posts.filter(getAvailable), ...pages.filter(getAvailable)]

  const categoriesInDocs = new Set(docs.map((item) => item.categories ?? []).flat())

  const categoriesFromDocs = await getTaxonomy(
    'content',
    'categories',
    Array.from(categoriesInDocs).filter(
      (i) => categories.find((j) => j.name === i) == null
    )
  )

  if (categoriesFromDocs) {
    categories.push(...categoriesFromDocs)
  }
  
  categories.forEach((i) => {
    i.count.posts = posts.filter((j) => j.categories?.includes(i.name)).length
    i.count.pages = pages.filter((j) => j.categories?.includes(i.name)).length
    i.count.total = i.count.posts + i.count.pages
  })

  const tagsInDocs = new Set(docs.map((item) => item.tags ?? []).flat())

  const tagsFromDocs = await getTaxonomy(
    'content',
    'tags',
    Array.from(tagsInDocs).filter((i) => tags.find((j) => j.name === i) == null)
  )

  if (tagsFromDocs) {
    tags.push(...tagsFromDocs)
  }

  tags.forEach((i) => {
    i.count.posts = posts.filter((j) => j.tags?.includes(i.name)).length
    i.count.pages = pages.filter((j) => j.tags?.includes(i.name)).length
    i.count.total = i.count.posts + i.count.pages
  })

  return {
    tagCount: tags.length,
    categoryCount: categories.length
  }
}
