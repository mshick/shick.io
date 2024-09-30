import { MDXContent } from '#/components/MDXContent'
import { getPage } from '#/content'
import { type ServerProps } from '#/types/types'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 60

type Params = {
  slug: string
}

export function generateMetadata(): Metadata {
  const page = getPage((value) => value.slug === 'index')
  return page?.meta ?? {}
}

export default function PagePage({ params }: ServerProps<Params>) {
  const page = getPage((value) => value.slug === params.slug)

  if (!page) {
    return notFound()
  }

  return (
    <div className="prose prose-sm prose-tufted dark:prose-invert max-w-none">
      <MDXContent code={page.code} />
    </div>
  )
}
