import '#/styles/globals.css'
import { config } from 'contentlayer/generated'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from 'next-themes'
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const { siteUrl, siteName, siteDescription, seo } = config

  return (
    <SessionProvider>
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
    </SessionProvider>
  )
}
