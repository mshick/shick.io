import { DefaultSeoProps } from 'next-seo'

// Dev config
export const commitSha = process.env.VERCEL_GITHUB_COMMIT_SHA ?? ''
export const vercelEnv = process.env.VERCEL_ENV ?? 'development'
export const isProduction = vercelEnv === 'production'
export const isDevelopment = vercelEnv === 'development'
export const isTest = process.env.NODE_ENV === 'test'
export const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'info'

// Site config
export const locale = process.env.NEXT_PUBLIC_LOCALE
const vercelUrl =
  process.env.NEXT_PUBLIC_VERCEL_URL &&
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`

const envUrl = process.env.NEXT_PUBLIC_SITE_URL

export const siteUrl = isProduction
  ? envUrl
  : vercelUrl ?? process.env.NEXT_PUBLIC_LOCAL_URL

// Content config
export const timezone = process.env.NEXT_PUBLIC_TIMEZONE
export const githubRepo = process.env.NEXT_PUBLIC_GITHUB_REPO
export const defaultBranch = process.env.NEXT_PUBLIC_DEFAULT_BRANCH
export const baseDir = process.cwd()
export const publicDirPath = 'public'
export const publicDir = `${baseDir}/${publicDirPath}`
export const contentDirPath = process.env.NEXT_PUBLIC_CONTENT_DIR
export const contentDir = `${baseDir}/${contentDirPath}`
export const contentTypePathMap = {
  pages: '/',
  articles: '/articles',
  tags: '/tags'
}

// SEO config
export const siteName = process.env.NEXT_PUBLIC_SITE_NAME
export const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION
export const siteTwitter = process.env.NEXT_PUBLIC_SITE_TWITTER
export const seo: DefaultSeoProps = {
  titleTemplate: `%s | ${siteName}`,
  defaultTitle: `${siteName} | ${siteDescription}`,
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
    handle: siteTwitter,
    site: siteTwitter,
    cardType: 'summary_large_image'
  }
}
