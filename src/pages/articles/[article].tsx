import { allArticles, config } from 'contentlayer/generated'
import { ArticleBody } from 'features/Article/ArticleBody'
import { ArticleFooter } from 'features/Article/ArticleFooter'
import { ArticleHeader } from 'features/Article/ArticleHeader'
import { getArticle, getArticlePageParams } from 'features/Article/utils'
import Layout from 'layouts/Article'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { NextSeoProps } from 'next-seo'
import { Article } from 'types'
import { getSingle } from 'utils/types'

export default function ArticlePage({
  article
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const {
    title,
    featuredImage,
    featuredImageUrl,
    excerpt,
    tags,
    publishedAt,
    updatedAt
  } = article

  const seo: NextSeoProps = {
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
      images: featuredImage
        ? [
            {
              url: new URL(featuredImageUrl, config.siteUrl).href,
              width: 850,
              height: 650,
              alt: featuredImage.alt ?? featuredImage.title ?? title
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
