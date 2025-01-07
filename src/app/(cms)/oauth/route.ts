import { devUrl, githubAuthUrl, isProduction } from '@/env';
import { NextResponse } from 'next/server';
import { getOptions } from '#/content';

export function GET() {
  const siteUrl = getOptions(['url']).url;
  const url = isProduction ? siteUrl : devUrl;
  return NextResponse.redirect(
    `${githubAuthUrl}&redirect_uri=${url}/oauth/callback`,
  );
}
