import { allPosts } from '.contentlayer/generated'
import type { Post } from '.contentlayer/generated'
import { ArticleLayout } from 'components/layout/article'

type PostProps = {
  post: Post
}

export default function Post({ post }: PostProps) {
  return <ArticleLayout article={post} />
}

export async function getStaticPaths() {
  return {
    paths: allPosts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = allPosts.find((post) => post.slug === params.slug)
  return { props: { post } }
}
