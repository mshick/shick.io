import { allArticles } from '.contentlayer/generated'
import type { Article } from '.contentlayer/generated'
import ArticleLayout from 'components/ArticleLayout'

export default function Article({ article }: { article: Article }) {
  return <ArticleLayout article={article} />
}

export async function getStaticPaths() {
  return {
    paths: allArticles.map((article) => ({ params: { slug: article.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const article = allArticles.find((article) => article.slug === params.slug)
  return { props: { article } }
}
