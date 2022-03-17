// import 'lib/styles.css'

import React from 'react'
import { ThemeProvider } from 'theme-ui'
import { DefaultSeo } from 'next-seo'
import { theme } from 'lib/theme'
import { seo } from 'lib/config'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <DefaultSeo {...seo} />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
