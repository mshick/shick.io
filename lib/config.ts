export const defaultBranch = process.env.DEFAULT_BRANCH ?? 'main'
export const nodeEnv = process.env.NODE_ENV ?? 'development'
export const vercelEnv = process.env.VERCEL_ENV ?? 'development'
export const isProduction =
  nodeEnv === 'production' || vercelEnv === 'production'
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
export const commitSha = process.env.VERCEL_GITHUB_COMMIT_SHA ?? ''
export const siteUrl =
  process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://www.shick.io'
