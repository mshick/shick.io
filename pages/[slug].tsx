import { allPages } from '.contentlayer/generated'
import { InferGetStaticPropsType } from 'next'
import ArticleLayout from 'layouts/article'

export default function Page({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <ArticleLayout article={page} />
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
