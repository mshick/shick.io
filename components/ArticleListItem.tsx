import type { Article } from '.contentlayer/generated'
import { Heading, Paragraph } from 'theme-ui'
import Link from './Link'
import { useMDXComponent } from 'next-contentlayer/hooks'
import components from './MDXComponents'

export default function ArticleListItem({
  title,
  excerpt,
  slug,
}: Pick<Article, 'title' | 'excerpt' | 'slug'>) {
  return (
    <Link href={`/articles/${slug}`} variant="unstyled">
      <Heading>{title}</Heading>
      <div dangerouslySetInnerHTML={{ __html: excerpt }} />
    </Link>
  )
}
