export const vercelEnv = process.env.VERCEL_ENV ?? 'development'
export const isProduction = vercelEnv === 'production'
export const isDevelopment = vercelEnv === 'development'
export const isPreview = vercelEnv === 'preview'
export const isTest = process.env.NODE_ENV === 'test'

export const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'info'

export const vercelUrl =
  process.env.NEXT_PUBLIC_VERCEL_URL &&
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`

export const localDevUrl =
  process.env.NEXT_PUBLIC_LOCAL_URL ?? 'http://localhost:1337'

export const commitSha = process.env.VERCEL_GITHUB_COMMIT_SHA ?? ''

/**
 * CMS
 */
export const githubClientId = process.env.GITHUB_CLIENT_ID
export const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
export const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}`
export const githubTokenUrl = 'https://github.com/login/oauth/access_token'

/**
 * Search
 */
export const searchFields = ['title', 'content', 'excerpt', 'tags']
export const searchStoreFields = [
  'title',
  'excerpt',
  'permalink',
  'publishedAt'
]
