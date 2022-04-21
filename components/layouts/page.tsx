import type { NextSeoProps } from 'next-seo'
import type { PropsWithChildren } from 'react'
import { Box, Container } from 'theme-ui'
import Header from '../components/Header'
import Main from '../components/Main'
import NavigationButton from '../components/NavigationButton'
import Seo from '../components/Seo'
import Sidebar from '../components/Sidebar'
import { AppProvider } from '../contexts/app-context'

export default function PageLayout({
  children,
  seo
}: PropsWithChildren<{ seo?: NextSeoProps }>) {
  return (
    <AppProvider>
      <Seo {...seo} />
      <Container>
        <Header />
        <Sidebar />
        <NavigationButton />
        <Box sx={{ pr: '12.5%' }}>
          <Main>{children}</Main>
        </Box>
      </Container>
    </AppProvider>
  )
}
