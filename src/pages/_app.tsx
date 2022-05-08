import ErrorBoundary from 'components/ErrorBoundary'
import GlobalStyles from 'components/GlobalStyles'
import { seo } from 'lib/config'
import { theme } from 'lib/theme'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import { ThemeProvider as ThemeUiThemeProvider } from 'theme-ui'

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <ThemeUiThemeProvider theme={theme}>
        <ThemeProvider attribute="class">
          <DefaultSeo {...seo} />
          <GlobalStyles />
          <Component {...pageProps} />
        </ThemeProvider>
      </ThemeUiThemeProvider>
    </ErrorBoundary>
  )
}
