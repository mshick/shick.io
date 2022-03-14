import type { PropsWithChildren } from 'react'
import type { NextSeoProps } from 'next-seo'
import { Container } from 'theme-ui'
import { AppProvider } from 'contexts/app-context'
import Seo from 'components/Seo'
import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import NavigationButton from 'components/NavigationButton'
import Main from 'components/Main'

export default function PageLayout({
  children,
  seo,
}: PropsWithChildren<{ seo: NextSeoProps }>) {
  return (
    <AppProvider>
      <Seo {...seo} />
      <Container>
        <Header />
        <Sidebar />
        <NavigationButton />
        <Main>{children}</Main>
      </Container>
    </AppProvider>
  )
}
