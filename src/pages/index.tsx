import { MDXContent } from '#/components/MDXContent'
import { HomepageHero } from '#/features/Homepage/HomepageHero'
import { HomepageList } from '#/features/Homepage/HomepageList'
import Layout from '#/layouts/Page'
import { components } from '#/mdx'
import { Article, Project } from '#/types/types'
import { pick } from '@contentlayer2/utils'
import { allArticles, allProjects } from 'contentlayer/generated'
import { getPage } from 'lib/helper'
import { InferGetStaticPropsType } from 'next'

export default function IndexPage({
  page,
  featuredArticles,
  featuredProjects
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const bodyComponents = {
    ...components,
    HomepageHero,
    HomepageArticlesList: () => (
      <HomepageList
        heading="featured posts"
        href="/articles"
        documents={featuredArticles}
      />
    ),
    HomepageProjectsList: () => (
      <HomepageList
        heading="featured projects"
        href="/projects"
        documents={featuredProjects}
      />
    )
  }

  return (
    <Layout seo={{ defaultTitle: page?.title }}>
      <MDXContent code={page.code} components={bodyComponents} />
    </Layout>
  )
}

export function getStaticProps() {
  const page = getPage((value) => value.slug === 'index')

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
    notFound: !page,
    props: {
      page: page!,
      featuredArticles,
      featuredProjects
    }
  }
}
