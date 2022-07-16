import { config } from 'contentlayer/generated'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from 'next-themes'
import 'styles/globals.css'

export default function App({ Component, pageProps }) {
  const { siteUrl, siteName, siteDescription, seo } = config

  return (
    <ThemeProvider attribute="class">
      <DefaultSeo
        canonical={siteUrl}
        titleTemplate={`%s | ${siteName}`}
        defaultTitle={`${siteName} | ${siteDescription}`}
        description={siteDescription}
        {...seo}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
