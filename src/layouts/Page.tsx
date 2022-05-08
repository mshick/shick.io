import type { NextSeoProps } from 'next-seo'
import type { PropsWithChildren } from 'react'
import { Container } from 'theme-ui'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Main from '../components/Main'
import Seo from '../components/Seo'
import Sidebar from '../components/Sidebar'

export default function PageLayout({
  children,
  seo
}: PropsWithChildren<{ seo?: NextSeoProps }>) {
  return (
    <>
      <Seo {...seo} />
      <Container>
        <Header />
        <Sidebar />
        <Main>{children}</Main>
        <Footer />
      </Container>
    </>
  )
}
