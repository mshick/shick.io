import { pick } from '@contentlayer/utils'
import { allArticles, allPages } from 'contentlayer/generated'
import { HomepageHero } from 'features/Homepage/HomepageHero'
import { HomepageList } from 'features/Homepage/HomepageList'
import Layout from 'layouts/Page'
import { components } from 'mdx'
import { InferGetStaticPropsType } from 'next'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { Article, Page } from 'types'

export default function IndexPage({
  page,
  featuredArticles
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Body = useMDXComponent(page.body.code, { featuredArticles })

  const bodyComponents = {
    ...components,
    HomepageHero,
    HomepageList
  }

  return (
    <Layout seo={{ defaultTitle: page.title }}>
      <Body components={bodyComponents} />
    </Layout>
  )
}

export async function getStaticProps() {
  const page = (allPages as unknown as Page[]).find(
    (page) => page.slug === 'index'
  )

  const featuredArticles = (allArticles as unknown as Article[])
    .map((doc) =>
      pick(doc, ['path', 'title', 'excerpt', 'publishedAt', 'featured'])
    )
    .sort(
      (a, b) =>
        Number(new Date(b['publishedAt'])) - Number(new Date(a['publishedAt']))
    )
    .filter((article) => article.featured)

  return {
    props: {
      page,
      featuredArticles
    }
  }
}
