// Dev
export const commitSha = process.env.VERCEL_GITHUB_COMMIT_SHA ?? ''
export const vercelEnv = process.env.VERCEL_ENV ?? 'development'
export const isProduction = vercelEnv === 'production'
export const isDevelopment = vercelEnv === 'development'
export const isTest = process.env.NODE_ENV === 'test'
export const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'info'

// URLs
export const vercelUrl =
  process.env.NEXT_PUBLIC_VERCEL_URL &&
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
export const localDevUrl =
  process.env.NEXT_PUBLIC_LOCAL_URL ?? 'http://localhost:3000'
export const canonicalUrl = process.env.NEXT_PUBLIC_CANONICAL_URL

// Contentlayer config
export const timezone = process.env.NEXT_PUBLIC_TIMEZONE ?? 'America/New_York'
export const baseDir = process.cwd()
export const publicDirPath = 'public'
export const publicDir = `${baseDir}/${publicDirPath}`
export const contentDirPath = process.env.NEXT_PUBLIC_CONTENT_DIR ?? 'content'
export const contentDir = `${baseDir}/${contentDirPath}`

export const editUrlPattern = process.env.NEXT_PUBLIC_EDIT_URL_PATTERN

const _contentTypePathMap = process.env.NEXT_PUBLIC_CONTENT_TYPE_PATH_MAP
// E.g., pages=/;articles=/posts;tags=/tagged
export const contentTypePathMap: Record<string, string> = _contentTypePathMap
  ? _contentTypePathMap.split(';').reduce((map, typePath) => {
      const [type, path] = typePath.split('=')
      if (!type) {
        return map
      }

      return {
        ...map,
        [type]: path
      }
    }, {})
  : {}
