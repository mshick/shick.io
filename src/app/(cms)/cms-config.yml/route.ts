import { devUrl, isLocal, isProduction } from '@/env';
import { NextResponse } from 'next/server';
import yaml from 'yaml';
import cmsConfigJson from '#/generated/cms/config.json';
import type { CmsConfig } from '#/types/decap-cms';

const config: CmsConfig = cmsConfigJson as CmsConfig;

if (!isProduction) {
  const url = new URL(devUrl);
  config.site_url = url.toString();
  config.local_backend = isLocal;
  config.backend.site_domain = url.host;
  config.backend.base_url = url.origin;
}

export function GET() {
  return new NextResponse(yaml.stringify(config));
}
