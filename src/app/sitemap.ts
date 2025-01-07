import type { MetadataRoute } from 'next';
import { getPages, getPosts } from '#/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = [
    ...getPages(['shareUrl', 'updatedAt']),
    ...getPosts(['shareUrl', 'updatedAt']),
  ];

  return docs.map(({ shareUrl, updatedAt }) => ({
    url: shareUrl,
    lastModified: updatedAt ?? 'monthly',
  }));
}
