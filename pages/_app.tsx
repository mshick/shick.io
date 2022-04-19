import GlobalStyles from 'components/components/GlobalStyles'
import { seo } from 'lib/config'
import { theme } from 'lib/theme'
import { DefaultSeo } from 'next-seo'
import React from 'react'
import { ThemeProvider } from 'theme-ui'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <DefaultSeo {...seo} />
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
