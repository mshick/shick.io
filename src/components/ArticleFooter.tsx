import { Box } from 'theme-ui'
import Link from './Link'

export type ArticleFooterProps = {
  editUrl?: string
  shareUrl?: string
  previous?: {
    path: string
    title: string
  }
  next?: {
    path: string
    title: string
  }
}

export default function ArticleFooter({
  editUrl,
  shareUrl,
  previous,
  next
}: ArticleFooterProps) {
  return (
    <Box as="footer" variant="layout.articleFooter">
      <Box sx={{ pb: 3 }}>
        {previous && (
          <Box>
            prev: <Link href={previous.path}>{previous.title}</Link>
          </Box>
        )}
        {next && (
          <Box>
            next: <Link href={next.path}>{next.title}</Link>
          </Box>
        )}
      </Box>
      <Box>
        {editUrl && (
          <Box sx={{ display: 'inline-block', mr: 6 }}>
            <Link href={editUrl}>edit on github -&gt;</Link>
          </Box>
        )}
        {shareUrl && (
          <Box sx={{ display: 'inline-block' }}>
            <Link
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                shareUrl
              )}`}
            >
              share on twitter -&gt;
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  )
}
