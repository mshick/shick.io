// @ts-nocheck
import { config } from 'contentlayer/generated'
import Document, { Head, Html, Main, NextScript } from 'next/document'
export default class CustomDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang={config.locale}>
        <Head />
        <body className="antialiased font-mono bg-white text-black dark:bg-black dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
