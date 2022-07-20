import { withSentryConfig } from '@sentry/nextjs'
import withPlugins from 'next-compose-plugins'
import { withContentlayer } from 'next-contentlayer'

const isBuild = process.argv.includes('build')

// https://securityheaders.com
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  child-src *.google.com *.youtube.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' fonts.gstatic.com
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

const config = {
  swcMinify: true,
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    domains: ['github.com', 'edwardtufte.github.io']
  },
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
    dirs: ['src']
  },
  images: {
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  experimental: {
    images: {
      allowFutureImage: true,
      remotePatterns: [
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
  },
  sentry: {
    hideSourceMaps: true
  }
}

export default withPlugins(
  [
    isBuild ? {} : withContentlayer,
    process.env.NEXT_PUBLIC_SENTRY_DSN
      ? (config) => withSentryConfig(config, { silent: true })
      : {}
  ],
  config
)
