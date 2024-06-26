import { SiteFooter } from '#/components/Site/SiteFooter'
import { SiteHeader } from '#/components/Site/SiteHeader'
import { plexMono } from '#/styles/fonts'
import '#/styles/globals.css'
import { getOptions } from '@/content'
import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren } from 'react'

const { title, url, description, locale } = getOptions([
  'title',
  'url',
  'description',
  'locale'
])

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s - ${title}`
  },
  description: description,
  alternates: {
    canonical: url
  },
  metadataBase: new URL(url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: title
  }
}

export default function Layout({ children }: PropsWithChildren) {
  const { name, links, repoUrl, socials } = getOptions([
    'name',
    'links',
    'repoUrl',
    'socials'
  ])

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${plexMono.variable} font-primary`}>
        <ThemeProvider attribute="class">
          <div className="mx-auto max-w-3xl px-8">
            <SiteHeader
              siteName={name}
              navigationItems={links.filter(
                (link) => link.type === 'navigation'
              )}
            />

            <main id="content">{children}</main>

            {/* <SiteFooter showListeningTo={config.showListeningTo} /> */}
            <SiteFooter repoUrl={repoUrl} socials={socials} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
