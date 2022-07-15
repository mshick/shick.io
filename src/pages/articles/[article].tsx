import { siteUrl } from 'config'
import { allArticles } from 'contentlayer/generated'
import { ArticleBody } from 'features/Article/ArticleBody'
import { ArticleFooter } from 'features/Article/ArticleFooter'
import { ArticleHeader } from 'features/Article/ArticleHeader'
import { getArticle, getArticlePageParams } from 'features/Article/utils'
import Layout from 'layouts/Article'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { Article } from 'types'
import { getSingle } from 'utils/types'

export default function ArticlePage({
  article
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { title, image, excerpt, tags, publishedAt, updatedAt } = article

  const seo = {
    title,
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      article: {
        publishedTime: publishedAt,
        modifiedTime: updatedAt,
        tags: tags.map((tag) => tag.name)
      },
      images: image
        ? [
            {
              url: new URL(image.url, siteUrl).href,
              width: 850,
              height: 650,
              alt: image.alt ?? image.title ?? title
            }
          ]
        : null
    }
  }

  return (
    <Layout seo={seo}>
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
    paths: getArticlePageParams(allArticles as unknown as Article[]),
    fallback: false
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = getSingle(params.article)
  const article = getArticle(slug, allArticles as unknown as Article[])

  return {
    notFound: !Boolean(article),
    props: {
      article
    }
  }
}
