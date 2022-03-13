import { allPages } from '.contentlayer/generated'
import type { Page } from '.contentlayer/generated'
import { PageLayout } from 'components/layout/page'

type PageProps = {
  page: Page
}

export default function Page({ page }: PageProps) {
  return <PageLayout page={page} />
}

export async function getStaticPaths() {
  return {
    paths: allPages.map((page) => ({ params: { slug: page.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const page = allPages.find((page) => page.slug === params.slug)
  return { props: { page } }
}
