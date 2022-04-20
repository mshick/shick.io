import type { DefaultSeoProps } from 'next-seo'

export const nodeEnv = process.env.NODE_ENV ?? 'development'

export const baseDir = process.cwd()
export const publicDirPath = 'public'
export const publicDir = `${baseDir}/${publicDirPath}`
export const contentDirPath = process.env.CONTENT_DIR ?? 'content'
export const contentDir = `${baseDir}/${contentDirPath}`

export const contentTypePathMap = {
  pages: '/',
  articles: '/articles',
  tags: '/tags'
}

export const timezone = process.env.TIMEZONE ?? 'America/New_York'

export const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'info'
export const logDestination =
  process.env.NEXT_PUBLIC_LOG_DESTINATION ?? 'stdout'

export const logflareApiKey = process.env.NEXT_PUBLIC_LOGFLARE_API_KEY ?? ''
export const logflareSourceToken =
  process.env.NEXT_PUBLIC_LOGFLARE_SOURCE_TOKEN ?? ''

export const siteName = 'Michael Shick'
export const siteDescription = 'My personal site.'
export const siteUrl = 'https://www.shick.us'
export const githubRepo = 'https://github.com/mshick/shick.io'

export const seo: DefaultSeoProps = {
  titleTemplate: `%s _ ${siteName}`,
  defaultTitle: siteName,
  description: siteDescription,
  canonical: siteUrl,
  additionalLinkTags: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    },
    {
      rel: 'manifest',
      href: '/manifest.json'
    }
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    site_name: siteName
  },
  twitter: {
    handle: '@michaelshick',
    site: '@michaelshick',
    cardType: 'summary_large_image'
  }
}

export const commitSha = process.env.VERCEL_GITHUB_COMMIT_SHA ?? ''
