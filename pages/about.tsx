import { allPages } from '.contentlayer/generated'
import ArticleLayout from 'components/layouts/article'
import logger from 'lib/logger'
import type { Page } from 'lib/types'
import { InferGetStaticPropsType } from 'next'
import { useEffect } from 'react'

export default function AboutPage({
  page
}: InferGetStaticPropsType<typeof getStaticProps>) {
  useEffect(() => {
    function getDate() {
      logger.info('Hello in the client!')
    }
    getDate()
  }, [])

  return (
    <>
      <ArticleLayout article={page} />
    </>
  )
}

export async function getStaticProps() {
  const page = (allPages as unknown as Page[]).find(
    (page) => page.slug === 'about'
  )
  return { props: { page } }
}
