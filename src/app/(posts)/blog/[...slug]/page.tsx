import { ArticleFooter } from '#/features/Article/ArticleFooter'
import { ArticleHeader } from '#/features/Article/ArticleHeader'
import { ServerProps } from '#/types/types'
import { getPostBySlug, getPosts } from '@/content'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 300

type Params = {
  slug: string[]
}

export function generateStaticParams() {
  const posts = getPosts(['slug'])

  if (!posts) {
    return notFound()
  }

  return posts.map((post) => ({ slug: post.slug.split('/') }))
}

export function generateMetadata({ params }: ServerProps<Params>): Metadata {
  const post = getPostBySlug(params.slug.join('/'))

  if (!post) {
    return {
      title: params.slug.join('/')
    }
  }

  return {
    title: post.title
  }
}

export default function BlogPage({ params }: ServerProps<Params>) {
  const post = getPostBySlug(params.slug.join('/'))

  if (!post) {
    return notFound()
  }

  return (
    <>
      <ArticleHeader {...post} />
      <ArticleFooter {...post} />
    </>
  )
}
