import { PropsWithChildren } from 'react'
import { Container, Box, Close } from 'theme-ui'
import { transparentize } from '@theme-ui/color'
import { Navigation } from './Navigation'
import {
  useAppDispatchContext,
  useAppStateContext,
} from './context/app-context'

const sidebarWidth = 260

export default function Main({ children }: PropsWithChildren<{}>) {
  const dispatch = useAppDispatchContext()
  const { isNavOpen } = useAppStateContext()
  return (
    <>
      <Container>
        <Box as="header" variant="layout.header">
          <Navigation />
        </Box>
        <Box
          variant="layout.sidebar"
          sx={{
            // left: [
            //   isNavOpen ? '0px' : `-${sidebarWidth}px`,
            //   isNavOpen ? '0px' : `-${sidebarWidth}px`,
            //   isNavOpen ? '0px' : `-${sidebarWidth}px`,
            //   '0px'
            // ]
            left: [isNavOpen ? '0px' : `-${sidebarWidth}px`],
          }}
        >
          <Box
            sx={{
              borderRight: (theme) =>
                `${theme.borderWidths[1]}px solid ${theme.colors.surface}`,
              height: '100%',
              // left: [
              //   `${isNavOpen ? 0 : `-${sidebarWidth}px`}`,
              //   `${isNavOpen ? 0 : `-${sidebarWidth}px`}`,
              //   `${isNavOpen ? 0 : `-${sidebarWidth}px`}`,
              //   0
              // ],
              left: [`${isNavOpen ? 0 : `-${sidebarWidth}px`}`],
              transition: '.3s ease-in-out left',
              position: 'relative',
            }}
          >
            <Navigation />
          </Box>
        </Box>
        <Box
          role="button"
          tabIndex={0}
          sx={{
            backgroundColor: transparentize('black', 0.2),
            // display: [
            //   isNavOpen ? 'flex' : 'none',
            //   isNavOpen ? 'flex' : 'none',
            //   isNavOpen ? 'flex' : 'none',
            //   'none'
            // ],
            display: [isNavOpen ? 'flex' : 'none'],
            height: '100%',
            justifyContent: 'flex-end',
            px: [3, 4],
            py: 2,
            position: 'fixed',
            transition: '.2s linear background-color',
            width: '100%',
            zIndex: 998,
            ':focus': {
              outline: 'none',
              backgroundColor: transparentize('black', 0.4),
            },
          }}
          onClick={() => dispatch({ type: 'closeNav' })}
          onKeyDown={(event) =>
            event.key === 'Enter' ? dispatch({ type: 'closeNav' }) : {}
          }
        >
          <Close />
        </Box>
        <Box as="main" variant="layout.main">
          {children}
        </Box>
      </Container>
    </>
  )
}
