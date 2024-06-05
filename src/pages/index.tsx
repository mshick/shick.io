import { HomepageHero } from '#/features/Homepage/HomepageHero'
import { HomepageList } from '#/features/Homepage/HomepageList'
import Layout from '#/layouts/Page'
import { components } from '#/mdx'
import { Article, Page, Project } from '#/types/types'
import { pick } from '@contentlayer2/utils'
import { allArticles, allPages, allProjects } from 'contentlayer/generated'
import { InferGetStaticPropsType } from 'next'
import { useMDXComponent } from 'next-contentlayer2/hooks'

export default function IndexPage({
  page,
  featuredArticles,
  featuredProjects
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Body = useMDXComponent(page?.body.code ?? '', {
    featuredArticles,
    featuredProjects
  })

  const bodyComponents = {
    ...components,
    HomepageHero,
    HomepageList
  }

  return (
    <Layout seo={{ defaultTitle: page?.title }}>
      <Body components={bodyComponents} />
    </Layout>
  )
}

export function getStaticProps() {
  const page = (allPages as unknown as Page[]).find(
    (page) => page.slug === 'index'
  )

  const featuredArticles = (allArticles as unknown as Article[])
    .map((doc) =>
      pick(doc, [
        'path',
        'title',
        'excerpt',
        'publishedAt',
        'featured',
        'featuredImage',
        'featuredImageUrl'
      ])
    )
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )
    .filter((doc) => doc.featured)

  const featuredProjects = (allProjects as unknown as Project[])
    .map((doc) =>
      pick(doc, [
        'path',
        'title',
        'excerpt',
        'publishedAt',
        'featured',
        'featuredImage',
        'featuredImageUrl'
      ])
    )
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )
    .filter((doc) => doc.featured)

  return {
    props: {
      page,
      featuredArticles,
      featuredProjects
    }
  }
}
