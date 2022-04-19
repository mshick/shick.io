import { Box } from 'theme-ui'
import { useAppStateContext } from '../contexts/app-context'

const sidebarWidth = 260

export default function Sidebar() {
  const { isNavOpen } = useAppStateContext()
  return (
    <Box
      variant="layout.sidebar"
      sx={{
        // left: [
        //   isNavOpen ? '0px' : `-${sidebarWidth}px`,
        //   isNavOpen ? '0px' : `-${sidebarWidth}px`,
        //   isNavOpen ? '0px' : `-${sidebarWidth}px`,
        //   '0px'
        // ]
        left: [isNavOpen ? '0px' : `-${sidebarWidth}px`]
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
          position: 'relative'
        }}
      >
        Sidebar!
      </Box>
    </Box>
  )
}
