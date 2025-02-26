import { isLocal, isProduction } from '@/env';
import { NextResponse } from 'next/server';
import cmsConfigDevelopmentJson from '#/generated/cms/development/config.json';
import cmsConfigLocalJson from '#/generated/cms/local/config.json';
import cmsConfigProductionJson from '#/generated/cms/production/config.json';

const config = isProduction
  ? cmsConfigProductionJson
  : isLocal
    ? cmsConfigLocalJson
    : cmsConfigDevelopmentJson;

export function GET() {
  return new NextResponse(JSON.stringify(config));
}
