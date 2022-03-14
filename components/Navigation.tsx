import { Fragment } from 'react'
import { Box, NavLink, Flex } from 'theme-ui'
import NextLink from 'next/link'
import { Logo } from './Logo'

export default function Navigation() {
  const pages = [
    {
      navigation: {
        label: 'Home',
        position: 0,
      },
      slug: '',
    },
    {
      navigation: {
        label: 'Articles',
        position: 1,
      },
      slug: 'articles',
    },
    {
      navigation: {
        label: 'About',
        position: 2,
      },
      slug: 'about',
    },
  ]

  const sortedPages = pages.sort((a, b) => {
    if (a.slug === '/') {
      return -1
    }

    if (a.navigation.position < b.navigation.position) {
      return -1
    }

    if (a.navigation.position > b.navigation.position) {
      return 1
    }

    return 0
  })

  return (
    <Fragment>
      <Box as="nav">
        <Flex
          as="ul"
          sx={{
            listStyle: 'none',
            p: 0,
          }}
        >
          {sortedPages?.map((item, index) => {
            const {
              navigation: { label },
              slug,
            } = item

            return (
              <Box
                key={index}
                as="li"
                sx={{
                  marginRight: 30,
                }}
              >
                <NextLink href={`/${slug}`} passHref>
                  <NavLink>{label}</NavLink>
                </NextLink>
              </Box>
            )
          })}
        </Flex>
      </Box>

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: [
            'flex-start',
            'flex-start',
            'flex-start',
            'flex-end',
          ],
        }}
      >
        {/* <Logo /> */}
      </Box>
    </Fragment>
  )
}
