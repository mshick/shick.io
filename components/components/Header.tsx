import { Box } from 'theme-ui'
import Navigation from './Navigation'

export default function Header() {
  return (
    <Box as="header" variant="layout.header">
      <Box
        sx={{
          width: '100%',
          borderBottom: (theme) =>
            `${theme.borderWidths[1]}px solid ${theme.colors.surface}`
        }}
      >
        <Navigation />
      </Box>
      {/* <Box sx={{ display: ['none', 'none', 'block'] }}>
        <Logo />
      </Box> */}
    </Box>
  )
}
