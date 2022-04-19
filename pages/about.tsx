import type { Page } from 'lib/types'
import { allPages } from '.contentlayer/generated'
import { InferGetStaticPropsType } from 'next'
import ArticleLayout from 'layouts/article'

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
