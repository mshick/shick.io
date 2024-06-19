import { MDXContent } from '#/components/MDXContent'
import { HomepageHero } from '#/features/Homepage/HomepageHero'
import { HomepageList } from '#/features/Homepage/HomepageList'
import { components } from '#/mdx'
import { getOptions, getPage, getPosts } from '@/content'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 60

export function generateMetadata(): Metadata {
  const page = getPage((value) => value.slug === 'index')
  return page?.meta ?? {}
}

export default function IndexPage() {
  const page = getPage((value) => value.slug === 'index')

  if (!page) {
    return notFound()
  }

  const { links } = getOptions(['links'])
  const blogLink = links.find((link) => link.text === 'blog')

  const posts = getPosts(
    ['permalink', 'title', 'excerpt', 'excerptHtml', 'publishedAt', 'featured'],
    ['tags'],
    (p) => p.featured
  )

  const bodyComponents = {
    ...components,
    HomepageHero,
    HomepagePostsList: () => (
      <HomepageList
        collectionName="posts"
        heading={blogLink?.text ?? 'posts'}
        href={blogLink?.path ?? '/posts/'}
        documents={posts}
      />
    )
  }

  return (
    <div className="prose prose-sm prose-tufted dark:prose-invert max-w-none">
      <MDXContent code={page.code} components={bodyComponents} />
    </div>
  )
}
