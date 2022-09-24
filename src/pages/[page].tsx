import { allPages, config } from 'contentlayer/generated'
import { PageBody } from 'features/Page/PageBody'
import { getPagePageParams } from 'features/Page/utils'
import Layout from 'layouts/Page'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { NextSeoProps } from 'next-seo'
import { Page } from 'types'
import { getSingle } from 'utils/types'

export default function PagePage({
  page
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const {
    title,
    featuredImageUrl,
    featuredImage,
    excerpt,
    tags,
    publishedAt,
    updatedAt
  } = page

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
      images: featuredImageUrl
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
      <PageBody {...page} />
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: getPagePageParams(
      allPages.filter((page) => page.slug !== 'index') as unknown as Page[]
    ),
    fallback: false
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = getSingle(params.page)
  const page = (allPages as unknown as Page[]).find(
    (page) => page.slug === slug
  )

  return {
    notFound: !Boolean(page),
    props: {
      page: page ?? null
    }
  }
}
