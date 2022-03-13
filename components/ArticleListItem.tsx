import type { Article } from '.contentlayer/generated'
import { Heading } from 'theme-ui'
import Link from './Link'
import { useMDXComponent } from 'next-contentlayer/hooks'
import components from './MDXComponents'

export default function ArticleListItem({
  title,
  excerpt,
  slug,
}: Pick<Article, 'title' | 'excerpt' | 'slug'>) {
  const Component = useMDXComponent(excerpt.code)
  return (
    <Link href={`/articles/${slug}`} variant="unstyled">
      <Heading>{title}</Heading>
      <Component components={components} />
    </Link>
  )
}
