import { SiteFooter } from '#/features/Site/SiteFooter'
import { SiteNavigation } from '#/features/Site/SiteNavigation'
import { plexMono } from '#/styles/fonts'
import '#/styles/globals.css'
import { config } from 'contentlayer/generated'
import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: {
    default: config.siteName,
    template: `%s - ${config.siteName}`
  },
  description: config.siteDescription,
  alternates: {
    canonical: config.siteUrl
  },
  metadataBase: new URL(config.siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: config.siteName
  }
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang={config.locale} suppressHydrationWarning>
      <body className={`${plexMono.variable} font-primary`}>
        <ThemeProvider attribute="class">
          <div className="mx-auto max-w-3xl px-8">
            <SiteNavigation items={config.navigation} />

            <main id="content">{children}</main>

            {/* <SiteFooter showListeningTo={config.showListeningTo} /> */}
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
