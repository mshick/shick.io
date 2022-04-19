import { allPages } from '.contentlayer/generated'
import ArticleLayout from 'layouts/article'
import logger from 'lib/logger'
import type { Page } from 'lib/types'
import { InferGetStaticPropsType } from 'next'

export default function AboutPage({
  page
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <ArticleLayout article={page} />
      <button onClick={() => logger.info('logging from client!')} />
    </>
  )
}

export async function getStaticProps() {
  const page = (allPages as unknown as Page[]).find(
    (page) => page.slug === 'about'
  )
  return { props: { page } }
}
