import { SiteFooter } from '#/features/Site/SiteFooter'
import { SiteHeader } from '#/features/Site/SiteHeader'
import { plexMono } from '#/styles/fonts'
import '#/styles/globals.css'
import { config } from 'contentlayer/generated'
import { getOptions } from 'lib/helper'
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
  const { name, navigation } = getOptions(['name', 'navigation'])

  return (
    <html lang={config.locale} suppressHydrationWarning>
      <body className={`${plexMono.variable} font-primary`}>
        <ThemeProvider attribute="class">
          <div className="mx-auto max-w-3xl px-8">
            <SiteHeader siteName={name} navigationItems={navigation} />

            <main id="content">{children}</main>

            {/* <SiteFooter showListeningTo={config.showListeningTo} /> */}
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
