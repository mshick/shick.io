import type { Article } from '.contentlayer/generated'
import { Heading } from 'theme-ui'
import Link from './Link'

export default function ArticleListItem({
  title,
  excerpt,
  path,
}: Pick<Article, 'title' | 'excerpt' | 'path'>) {
  return (
    <Link href={path} variant="unstyled">
      <Heading>{title}</Heading>
      <div dangerouslySetInnerHTML={{ __html: excerpt }} />
    </Link>
  )
}
