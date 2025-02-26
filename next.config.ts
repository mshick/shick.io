import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

// https://securityheaders.com
const ContentSecurityPolicy = `
  default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
  script-src * 'unsafe-inline' 'unsafe-eval' data:;
`;

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const securityHeaders: { key: string; value: string }[] = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  // Opt-out of Google FLoC: https://amifloced.org/
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // headers prevents `next export`
  async headers() {
    return Promise.resolve([
      // {
      //   source: '/(.*)',
      //   headers: securityHeaders
      // },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]);
  },
  // redirects prevents `next export`
  async redirects() {
    return Promise.resolve([
      {
        source: '/michael-shick-2022.pdf',
        destination: 'https://read.cv/mshick',
        permanent: false,
      },
      {
        source: '/resume',
        destination: 'https://read.cv/mshick',
        permanent: false,
      },
      {
        source: '/30',
        destination: 'https://calendly.com/michaelshick/30min',
        permanent: false,
      },
      {
        source: '/15',
        destination: 'https://calendly.com/michaelshick/15min',
        permanent: false,
      },
    ]);
  },
  // output: 'export',
  eslint: {
    // Don't actually use eslint during next builds
    ignoreDuringBuilds: true,
  },
  images: {
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edwardtufte.github.io',
      },
      {
        protocol: 'https',
        hostname: '**.github.io',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
  // Doesn't seem to work in Vercel builds
  experimental: {
    turbo: {
      rules: {
        '*.txt': {
          loaders: ['raw-loader'],
        },
      },
    },
  },
};

function defineConfig(config: NextConfig) {
  return () => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return withSentryConfig(
        { ...config, sentry: { hideSourceMaps: true } },
        { silent: true },
      );
    }

    return config;
  };
}

export default defineConfig(nextConfig);
