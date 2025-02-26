import type { MetadataRoute } from 'next';
import { isProduction } from '~/lib/env';
import { getSiteUrl } from '#/content';

export default function robots(): MetadataRoute.Robots {
  const allow = [];
  const disallow = ['/admin/'];

  if (isProduction) {
    allow.push('/');
  } else {
    disallow.push('/');
  }

  return {
    rules: {
      userAgent: '*',
      allow,
      disallow,
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
