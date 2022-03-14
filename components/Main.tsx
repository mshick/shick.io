import type { PropsWithChildren } from 'react'
import { Box } from 'theme-ui'

export default function Main({ children }: PropsWithChildren<{}>) {
  return (
    <Box as="main" variant="layout.main">
      {children}
    </Box>
  )
}
