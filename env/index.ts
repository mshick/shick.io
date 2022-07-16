// Dev config
export const commitSha = process.env.VERCEL_GITHUB_COMMIT_SHA ?? ''
export const vercelEnv = process.env.VERCEL_ENV ?? 'development'
export const isProduction = vercelEnv === 'production'
export const isDevelopment = vercelEnv === 'development'
export const isTest = process.env.NODE_ENV === 'test'
export const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'info'

// Site config
export const locale = process.env.NEXT_PUBLIC_LOCALE
export const vercelUrl =
  process.env.NEXT_PUBLIC_VERCEL_URL &&
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
export const localDevUrl =
  process.env.NEXT_PUBLIC_LOCAL_URL ?? 'http://localhost:3000'
export const canonicalUrl = process.env.NEXT_PUBLIC_CANONICAL_URL

// Content config
export const timezone = process.env.NEXT_PUBLIC_TIMEZONE
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

export const githubRepo = process.env.NEXT_PUBLIC_GITHUB_REPO
export const defaultBranch = process.env.NEXT_PUBLIC_DEFAULT_BRANCH
