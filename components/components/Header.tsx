import { Fragment } from 'react'
import { Box } from 'theme-ui'
import Navigation from './Navigation'

export default function Header() {
  return (
    <Fragment>
      <Box as="header" variant="layout.header">
        <Navigation />
      </Box>
    </Fragment>
  )
}
