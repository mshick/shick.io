import { Box } from 'theme-ui'
import Navigation from './Navigation'

export default function Header() {
  return (
    <Box as="header" variant="layout.header">
      <Navigation />
      {/* <Box sx={{ display: ['none', 'none', 'block'] }}>
        <Logo />
      </Box> */}
    </Box>
  )
}
