import { withSentryConfig } from '@sentry/nextjs'

const isDev = process.argv.includes('dev')

// https://securityheaders.com
const ContentSecurityPolicy = `
  default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
  script-src * 'unsafe-inline' 'unsafe-eval' data:;
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
  trailingSlash: true,
  // headers prevents next export
  async headers() {
    return [
      // {
      //   source: '/(.*)',
      //   headers: securityHeaders
      // },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  // redirects prevents next export
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
  // output: 'export',
  eslint: {
    dirs: ['src', 'lib']
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
  },
  // Doesn't seem to work in Vercel builds
  experimental: {
    turbo: {
      rules: {
        '*.txt': {
          loaders: ['raw-loader']
        }
      }
    }
  }
}

if (!process.env.VELITE_STARTED && isDev) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: true, clean: false })
}

let config = nextConfig

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  config = withSentryConfig(
    { ...nextConfig, sentry: { hideSourceMaps: true } },
    { silent: true }
  )
}

export default config
