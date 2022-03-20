import Document, { Html, Head, Main, NextScript } from 'next/document'
import { theme } from 'lib/theme'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            href="/fonts/bitstream-vera-sans-mono-regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/bitstream-vera-sans-mono-italic.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/bitstream-vera-sans-mono-bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/bitstream-vera-sans-mono-bold-italic.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <meta
            name="msapplication-TileColor"
            content={theme.colors.primary as string}
          />
          <meta name="theme-color" content={theme.colors.primary as string} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
