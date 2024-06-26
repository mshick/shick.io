import { PostBody } from '#/components/Post/PostBody'
import { PostFooter } from '#/components/Post/PostFooter'
import { PostHeader } from '#/components/Post/PostHeader'
import { ServerProps } from '#/types/types'
import { getPostBySlug, getPostWithRelated, getPosts } from '@/content'
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

export default function PostPage({ params }: ServerProps<Params>) {
  const post = getPostWithRelated(
    (p) => p.slug === params.slug.join('/'),
    undefined,
    ['tags']
  )

  if (!post) {
    return notFound()
  }

  return (
    <>
      <PostHeader {...post} />
      <PostBody {...post} />
      <PostFooter {...post} />
    </>
  )
}
