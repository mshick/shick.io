import { PageBody } from '#/features/Page/PageBody'
import { getPagePageParams } from '#/features/Page/utils'
import Layout from '#/layouts/Page'
import { Page } from '#/types/types'
import { getSeoProps } from '#/utils/seo'
import { getSingle } from '#/utils/types'
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

export async function getStaticPaths() {
  return {
    paths: getPagePageParams(
      allPages.filter((page) => page.slug !== 'index') as unknown as Page[]
    ),
    fallback: false
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = getSingle(params?.page)
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
