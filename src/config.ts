import type { DefaultSeoProps } from 'next-seo'

export const locale = process.env.NEXT_PUBLIC_LOCALE ?? 'en-US'

export const nodeEnv = process.env.NODE_ENV ?? 'development'
export const vercelEnv = process.env.VERCEL_ENV ?? 'development'
export const isProduction =
  nodeEnv === 'production' || vercelEnv === 'production'
export const isTest = process.env.NODE_ENV === 'test'

export const defaultBranch = 'main'
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

export const siteName = 'michael_shick'
export const siteDescription = 'My personal site.'
export const siteUrl =
  process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://www.shick.io'

export const siteTitleStyle =
  process.env.NEXT_PUBLIC_SITE_TITLE_STYLE ?? 'snakeCase'

export const seo: DefaultSeoProps = {
  titleTemplate: `%s__${siteName}`,
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
      href: '/favicon-16x16.png',
      sizes: '16x16'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon-32x32.png',
      sizes: '32x32'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon-192x192.png',
      sizes: '192x192'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon-256x256.png',
      sizes: '256x256'
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      href: '/apple-touch-icon.png',
      sizes: '180x180'
    },
    {
      rel: 'manifest',
      href: '/manifest.json'
    },
    {
      rel: 'preload',
      href: '/fonts/bitstream-vera-sans-mono-regular.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    },
    {
      rel: 'preload',
      href: '/fonts/bitstream-vera-sans-mono-bold.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    },
    {
      rel: 'preload',
      href: '/fonts/bitstream-vera-sans-mono-italic.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    },
    {
      rel: 'preload',
      href: '/fonts/bitstream-vera-sans-mono-bold-italic.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
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

export const navigation = {
  items: [
    {
      label: 'home',
      path: '/',
      current: false
    },
    {
      label: 'articles',
      path: '/articles/',
      current: false
    },
    {
      label: 'about',
      path: '/about/',
      current: false
    }
  ]
}
