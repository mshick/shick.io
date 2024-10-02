declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // A hack to make unlisted values less useful
      [key: string]: symbol
      VERCEL?: string
      VERCEL_GITHUB_COMMIT_SHA?: string
      VERCEL_ENV?: string
      NEXT_PUBLIC_LOG_LEVEL?: string
      NEXT_PUBLIC_SITE_URL?: string
      NEXT_PUBLIC_VERCEL_URL?: string
      NEXT_PUBLIC_LOCAL_URL?: string
      MUSICKIT_PRIVATE_KEY?: string
      MUSICKIT_KEY_ID?: string
      MUSICKIT_TEAM_ID?: string
      MUSICKIT_MUSIC_USER_TOKEN?: string
      API_SECRET?: string
      GITHUB_CLIENT_ID?: string
      GITHUB_CLIENT_SECRET?: string
      ENV_VAR_KEY?: string
      SITE_URL?: string
      SITE_TOKEN?: string
      VERCEL_TOKEN?: string
    }
  }
}

export {}
