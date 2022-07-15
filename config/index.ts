import { DefaultSeoProps } from 'next-seo'

export const locale = process.env.NEXT_PUBLIC_LOCALE ?? 'en-US'

export const commitSha = process.env.VERCEL_GITHUB_COMMIT_SHA ?? ''
export const vercelEnv = process.env.VERCEL_ENV ?? 'development'
export const isProduction = vercelEnv === 'production'
export const isDevelopment = vercelEnv === 'development'
export const isTest = process.env.NODE_ENV === 'test'

export const githubRepo = process.env.GITHUB_REPO ?? 'mshick/shick.io'
export const defaultBranch = process.env.DEFAULT_BRANCH ?? 'main'

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

export const siteName = 'Michael Shick'
export const siteDescription = 'My personal site.'

const vercelUrl =
  process.env.NEXT_PUBLIC_VERCEL_URL &&
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`

const envUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shick.io'

export const siteUrl = isProduction
  ? envUrl
  : vercelUrl ?? 'http://localhost:3000'

export const seo: DefaultSeoProps = {
  titleTemplate: `%s | ${siteName}`,
  defaultTitle: `${siteName} | Software engineer, happy camper.`,
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
