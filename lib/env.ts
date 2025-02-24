export const vercelEnv = process.env.VERCEL_ENV ?? 'development';
export const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'info';
export const commitSha = process.env.VERCEL_GITHUB_COMMIT_SHA ?? '';

/**
 * Environment flags
 */
export const isLocal = process.env.VERCEL !== '1';
export const isProduction = vercelEnv === 'production';
export const isDevelopment = vercelEnv === 'development';
export const isPreview = vercelEnv === 'preview';
export const isTest = process.env.NODE_ENV === 'test';

/**
 * URLs
 */
export const vercelDevUrl =
  process.env.NEXT_PUBLIC_VERCEL_URL &&
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
export const localDevUrl =
  process.env.NEXT_PUBLIC_LOCAL_URL ?? 'http://localhost:1337';
export const devUrl = vercelDevUrl ?? localDevUrl;

/**
 * CMS
 */
export const githubClientId = process.env.GITHUB_CLIENT_ID;
export const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
export const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}`;
export const githubTokenUrl = 'https://github.com/login/oauth/access_token';
export const publicRootPath = process.env.PUBLIC_ROOT_PATH ?? 'public';
export const uploadsBaseUrl = process.env.UPLOADS_BASE_URL ?? '/uploads/';
export const uploadsFolderPath =
  process.env.UPLOADS_FOLDER_PATH ?? 'public/uploads';

/**
 * Search
 */

/**
 * Relative to ./src
 */
export const searchIndexOutputPath = 'generated/search/index.json';
export const searchFields = [
  'title',
  'content',
  'excerpt',
  'tags',
  'categories',
] as const;
export const searchStoreFields = [
  'title',
  'excerpt',
  'permalink',
  'publishedAt',
] as const;
export const searchStoreBoost = {
  title: 2,
  tags: 2,
  excerpt: 1.5,
};
