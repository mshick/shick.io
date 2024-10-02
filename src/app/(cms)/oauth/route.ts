import { githubAuthUrl, siteUrl } from '@/env'
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.redirect(
    `${githubAuthUrl}&redirect_uri=${siteUrl}/oauth/callback`
  )
}
