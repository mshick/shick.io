import NextLink from 'next/link'
import { Fragment } from 'react'
import { Box, Flex, NavLink } from 'theme-ui'

export default function Navigation() {
  const pages = [
    {
      navigation: {
        label: 'home',
        position: 0
      },
      path: '/'
    },
    {
      navigation: {
        label: 'articles',
        position: 1
      },
      path: '/articles'
    },
    {
      navigation: {
        label: 'about',
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
