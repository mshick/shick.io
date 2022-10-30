import { allArticles } from 'contentlayer/generated'
import { ArticleBody } from 'features/Article/ArticleBody'
import { ArticleFooter } from 'features/Article/ArticleFooter'
import { ArticleHeader } from 'features/Article/ArticleHeader'
import { getArticle } from 'features/Article/utils'
import Layout from 'layouts/Article'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { Article } from 'types'
import { getSeoProps } from 'utils/seo'
import { getSingle } from 'utils/types'

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

export async function getStaticPaths() {
  return {
    paths: allArticles.map((article) => ({
      params: {
        article: article.slug
      }
    })),
    fallback: false
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = getSingle(params?.article)
  const article = slug && getArticle(slug, allArticles as unknown as Article[])

  return {
    notFound: !Boolean(article),
    props: {
      article
    }
  }
}
