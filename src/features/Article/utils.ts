import { Article } from '#/types'

export function getArticle(slug: string, articles: Article[]) {
  const orderedArticles = articles.sort(
    (a, b) =>
      Number(new Date(b['publishedAt'])) - Number(new Date(a['publishedAt']))
  )

  const articleIndex = orderedArticles.findIndex(
    (article) => article.slug === slug
  )

  if (articleIndex === -1) {
    return null
  }

  const article = {
    ...orderedArticles[articleIndex],
    next: orderedArticles[articleIndex - 1]
      ? {
          path: orderedArticles[articleIndex - 1].path,
          title: orderedArticles[articleIndex - 1].title
        }
      : null,
    previous: orderedArticles[articleIndex + 1]
      ? {
          path: orderedArticles[articleIndex + 1].path,
          title: orderedArticles[articleIndex + 1].title
        }
      : null
  }

  return article
}
