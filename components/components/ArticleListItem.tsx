import type { Article } from '.contentlayer/generated'
import { Box, Heading } from 'theme-ui'
import Link from './Link'

export default function ArticleListItem({
  title,
  excerpt,
  path
}: Pick<Article, 'title' | 'excerpt' | 'path'>) {
  return (
    <Link href={path} variant="unstyled">
      <Heading sx={{ mb: 0 }}>{title}</Heading>
      <Box variant="layout.excerpt">
        <div dangerouslySetInnerHTML={{ __html: excerpt }} />
      </Box>
    </Link>
  )
}
