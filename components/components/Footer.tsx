import { siteName } from 'lib/config'
import { Box } from 'theme-ui'

export type FooterProps = {
  editUrl?: string
}

export default function Footer({ editUrl }: FooterProps) {
  return (
    <Box as="footer" variant="layout.footer">
      {siteName}
    </Box>
  )
}
