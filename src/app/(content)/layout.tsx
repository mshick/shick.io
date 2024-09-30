import { SiteFooter } from '#/components/Site/SiteFooter'
import { SiteHeader } from '#/components/Site/SiteHeader'
import { getOptions } from '#/content'
import { plexMono } from '#/styles/fonts'
import '#/styles/globals.css'
import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren } from 'react'

const { title, url, description } = getOptions(['title', 'url', 'description'])

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

  const navigationItems = links.filter((link) => link.type === 'navigation')

  return (
    <body
      className={`${plexMono.variable} font-primary h-svh mx-auto max-w-3xl px-8 flex flex-col`}
    >
      <ThemeProvider attribute="class">
        <SiteHeader siteName={name} navigationItems={navigationItems} />
        <main id="content" className="flex flex-col flex-1">
          {children}
        </main>
        <SiteFooter repoUrl={repoUrl} socials={socials} />
      </ThemeProvider>
    </body>
  )
}