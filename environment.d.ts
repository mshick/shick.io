declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // A hack to make unlisted values less useful
      [key: string]: symbol
      NODE_ENV?: string
      NEXT_PUBLIC_TIMEZONE?: string
      NEXT_PUBLIC_CONTENT_DIR?: string
      VERCEL_GITHUB_COMMIT_SHA?: string
      VERCEL_ENV?: string
      NEXT_PUBLIC_LOG_LEVEL?: string
      NEXT_PUBLIC_VERCEL_URL?: string
      NEXT_PUBLIC_LOCAL_URL?: string
      NEXT_PUBLIC_CANONICAL_URL?: string
      NEXT_PUBLIC_EDIT_URL_PATTERN?: string
      NEXT_PUBLIC_CONTENT_TYPE_PATH_MAP?: string
      MUSICKIT_PRIVATE_KEY?: string
      MUSICKIT_KEY_ID?: string
      MUSICKIT_TEAM_ID?: string
      MUSICKIT_MUSIC_USER_TOKEN?: string
      API_SECRET?: string
    }
  }
}

export {}
