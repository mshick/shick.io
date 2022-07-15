import { seo } from 'config'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from 'next-themes'
import 'styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    // <ErrorBoundary>
    <ThemeProvider attribute="class">
      <DefaultSeo {...seo} />
      <Component {...pageProps} />
    </ThemeProvider>
    // </ErrorBoundary>
  )
}
