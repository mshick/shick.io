import { PageBody } from '#/components/Page/PageBody'
import { getPagePageParams } from '#/components/Page/utils'
import Layout from '#/layouts/Page'
import { getSeoProps } from '#/lib/utils/seo'
import { getSingle } from '#/lib/utils/types'
import { Page } from '#/types/types'
import { allPages } from 'contentlayer/generated'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

export default function PagePage({
  page
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!page) {
    return
  }

  return (
    <Layout seo={getSeoProps(page)}>
      <PageBody {...page} />
    </Layout>
  )
}

export function getStaticPaths() {
  return {
    paths: getPagePageParams(
      allPages.filter((page) => page.slug !== 'index') as unknown as Page[]
    ),
    fallback: false
  }
}

export function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = getSingle(params?.['page'])
  const page = (allPages as unknown as Page[]).find(
    (page) => page.slug === slug
  )

  return {
    notFound: !page,
    props: {
      page: page ?? null
    }
  }
}
