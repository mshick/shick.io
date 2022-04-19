import { Fragment } from 'react'
import { Box, NavLink, Flex } from 'theme-ui'
import NextLink from 'next/link'

export default function Navigation() {
  const pages = [
    {
      navigation: {
        label: 'Home',
        position: 0
      },
      path: '/'
    },
    {
      navigation: {
        label: 'Articles',
        position: 1
      },
      path: '/articles'
    },
    {
      navigation: {
        label: 'About',
        position: 2
      },
      path: '/about'
    }
  ]

  return (
    <Fragment>
      <Box as="nav">
        <Flex
          as="ul"
          sx={{
            listStyle: 'none',
            p: 0
          }}
        >
          {pages?.map((item, index) => {
            const {
              navigation: { label },
              path
            } = item

            return (
              <Box
                key={index}
                as="li"
                sx={{
                  marginRight: 30
                }}
              >
                <NextLink href={path} passHref>
                  <NavLink>{label}</NavLink>
                </NextLink>
              </Box>
            )
          })}
        </Flex>
      </Box>
    </Fragment>
  )
}
