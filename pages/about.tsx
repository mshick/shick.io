import { allPages } from '.contentlayer/generated'
import ArticleLayout from 'components/layouts/article'
import type { Page } from 'lib/types'
import { InferGetStaticPropsType } from 'next'

export default function AboutPage({
  page
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <ArticleLayout article={page} />
}

export async function getStaticProps() {
  const page = (allPages as unknown as Page[]).find(
    (page) => page.slug === 'about'
  )
  return { props: { page } }
}
