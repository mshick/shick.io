import { allArticles } from '.contentlayer/generated'
import ArticleLayout from 'components/layouts/article'
import orderBy from 'lodash-es/orderBy'
import type { InferGetStaticPropsType } from 'next'

export default function Article({
  article
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // @ts-expect-error
  return <ArticleLayout article={article} />
}

export async function getStaticPaths() {
  return {
    paths: allArticles.map((article) => ({ params: { slug: article.slug } })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const orderedArticles = orderBy(allArticles, ['updatedAt'], ['asc'])

  const articleIndex = orderedArticles.findIndex(
    (article) => article.slug === params.slug
  )
  const article = {
    ...orderedArticles[articleIndex],
    previous: orderedArticles[articleIndex - 1]
      ? {
          path: orderedArticles[articleIndex - 1].path,
          title: orderedArticles[articleIndex - 1].title
        }
      : null,
    next: orderedArticles[articleIndex + 1]
      ? {
          path: orderedArticles[articleIndex + 1].path,
          title: orderedArticles[articleIndex + 1].title
        }
      : null
  }

  return { props: { article } }
}
