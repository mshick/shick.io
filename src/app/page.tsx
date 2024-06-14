import { MDXContent } from '#/components/MDXContent'
import { HomepageHero } from '#/features/Homepage/HomepageHero'
import { HomepageList as HomepageListVelite } from '#/features/Homepage/HomepageListVelite'
import { components } from '#/mdx'
import { getPage, getPosts } from 'lib/helper'
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

  const posts = getPosts(
    ['permalink', 'title', 'excerpt', 'excerptHtml', 'publishedAt', 'featured'],
    ['tags'],
    (p) => p.featured
  )

  const bodyComponents = {
    ...components,
    // p: ({ children }) => (
    //   <p className="mb-2 leading-6 max-w-3xl text-sm text-zinc-900">
    //     {children}
    //   </p>
    // ),
    HomepageHero,
    HomepageArticlesList: () => (
      <HomepageListVelite heading="blog" href="/articles" documents={posts} />
    )
  }

  return (
    <div className="prose prose-tufted dark:prose-invert">
      <MDXContent code={page.code} components={bodyComponents} />
    </div>
  )
}
