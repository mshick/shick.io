import { githubAuthUrl, isDevelopment } from '@/env'
import { NextResponse } from 'next/server'

export function GET() {
  const redirectUri = isDevelopment
    ? `${githubAuthUrl}&redirect_uri=http://localhost:1337/oauth/callback`
    : githubAuthUrl

  return NextResponse.redirect(redirectUri)
}
