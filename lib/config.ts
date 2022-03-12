import type { DefaultSeoProps } from 'next-seo'

export const siteName = 'Michael Shick'
export const siteDescription = 'My personal site.'
export const siteUrl = 'https://www.shick.us'

export const seo: DefaultSeoProps = {
  titleTemplate: `%s ⊆ ${siteName}`,
  defaultTitle: siteName,
  description: siteDescription,
  canonical: siteUrl,
  additionalLinkTags: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    site_name: siteName,
  },
  twitter: {
    handle: '@michaelshick',
    site: '@michaelshick',
    cardType: 'summary_large_image',
  },
}
