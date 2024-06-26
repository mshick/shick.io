import { ArticleBody } from '#/components/Article/ArticleBody'
import { ArticleFooter } from '#/components/Article/ArticleFooter'
import { ArticleHeader } from '#/components/Article/ArticleHeader'
import { getArticle } from '#/components/Article/utils'
import Layout from '#/layouts/Article'
import { getSeoProps } from '#/lib/utils/seo'
import { getSingle } from '#/lib/utils/types'
import { Article } from '#/types/types'
import { allArticles } from 'contentlayer/generated'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

export default function ArticlePage({
  article
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!article) {
    return
  }

  return (
    <Layout seo={getSeoProps(article)}>
      <div className="mb-8">
        <ArticleHeader {...article} />
      </div>
      <ArticleBody {...article} />
      <ArticleFooter {...article} />
    </Layout>
  )
}

export function getStaticPaths() {
  return {
    paths: allArticles.map((article) => ({
      params: {
        article: article.slug
      }
    })),
    fallback: false
  }
}

export function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = getSingle(params?.['article'])
  const article = slug && getArticle(slug, allArticles as unknown as Article[])

  return {
    notFound: !article,
    props: {
      article: article as any
    }
  }
}
