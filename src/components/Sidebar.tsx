import { useAtomValue } from 'jotai'
import { isSidebarOpenAtom } from 'store'
import { Box } from 'theme-ui'

const sidebarWidth = 260

export default function Sidebar() {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom)

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
        left: [isSidebarOpen ? '0px' : `-${sidebarWidth}px`]
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
          left: [`${isSidebarOpen ? 0 : `-${sidebarWidth}px`}`],
          transition: '.3s ease-in-out left',
          position: 'relative'
        }}
      >
        Sidebar!
      </Box>
    </Box>
  )
}
