import { getOptions } from '#/content'
import { devUrl, githubAuthUrl, isProduction } from '@/env'
import { NextResponse } from 'next/server'

export function GET() {
  const siteUrl = getOptions(['url']).url
  const url = isProduction ? siteUrl : devUrl
  return NextResponse.redirect(
    `${githubAuthUrl}&redirect_uri=${url}/oauth/callback`
  )
}
