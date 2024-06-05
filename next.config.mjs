import { withContentCollections } from '@content-collections/next'
import { withSentryConfig } from '@sentry/nextjs'

const isBuild = process.argv.includes('build')
const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN

/**
 * Add your own CSP here...
 */
// https://securityheaders.com
const ContentSecurityPolicy = `
  default-src * 'unsafe-inline' 'unsafe-eval' data:;
  script-src * 'unsafe-inline' 'unsafe-eval' data:;
  worker-src * blob:;
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, '')
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  // Opt-out of Google FLoC: https://amifloced.org/
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/fonts/bitstream-vera-sans-mono-regular.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/fonts/bitstream-vera-sans-mono-bold.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/fonts/bitstream-vera-sans-mono-italic.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/fonts/bitstream-vera-sans-mono-bold-italic.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/michael-shick-2022.pdf',
        destination: 'https://read.cv/mshick',
        permanent: false
      },
      {
        source: '/resume',
        destination: 'https://read.cv/mshick',
        permanent: false
      },
      {
        source: '/30',
        destination: 'https://calendly.com/michaelshick/30min',
        permanent: false
      },
      {
        source: '/15',
        destination: 'https://calendly.com/michaelshick/15min',
        permanent: false
      }
    ]
  },
  webpack(config) {
    // Contentlayer generates many warnings:
    // Build dependencies behind this expression are ignored and might cause incorrect cache invalidation
    config.infrastructureLogging = {
      level: 'error'
    }

    config.module = {
      ...config.module,
      rules: config.module.rules.concat([
        {
          test: /\.txt$/,
          type: 'asset/source'
        }
      ])
    }

    return config
  },
  eslint: {
    dirs: ['src', 'lib', 'env']
  },
  images: {
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edwardtufte.github.io'
      },
      {
        protocol: 'https',
        hostname: '**.github.io'
      },
      {
        protocol: 'https',
        hostname: 'github.com'
      }
    ]
  }
}

/**
 * @param {Array<(config: import('next').NextConfig) => any>} plugins
 * @param {import('next').NextConfig} config
 */
const withPlugins = (plugins, config) => () =>
  plugins.reduce((acc, plugin) => plugin(acc), {
    ...config
  })

export default withPlugins(
  [
    (config) => (isBuild ? config : withContentCollections(config)),
    (config) =>
      sentryDsn
        ? withSentryConfig(
            { ...config, sentry: { hideSourceMaps: true } },
            { silent: true }
          )
        : config
  ],
  nextConfig
)
