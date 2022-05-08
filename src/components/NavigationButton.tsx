import { transparentize } from '@theme-ui/color'
import { Box, Close } from 'theme-ui'
import {
  useAppDispatchContext,
  useAppStateContext
} from '../contexts/app-context'

export default function NavigationButton() {
  const dispatch = useAppDispatchContext()
  const { isNavOpen } = useAppStateContext()
  return (
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
          backgroundColor: transparentize('black', 0.4)
        }
      }}
      onClick={() => dispatch({ type: 'closeNav' })}
      onKeyDown={(event) =>
        event.key === 'Enter' ? dispatch({ type: 'closeNav' }) : {}
      }
    >
      <Close />
    </Box>
  )
}
