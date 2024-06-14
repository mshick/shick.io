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
  process.env.NEXT_PUBLIC_LOCAL_URL ?? 'http://localhost:3000'

export const commitSha = process.env.VERCEL_GITHUB_COMMIT_SHA ?? ''
