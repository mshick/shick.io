import { siteTitleStyle, siteUrl } from 'lib/config'
import camelCase from 'lodash-es/camelCase'
import snakeCase from 'lodash-es/snakeCase'
import type { NextSeoProps } from 'next-seo'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

export default function Seo({ title, ...props }: NextSeoProps) {
  const { asPath } = useRouter()
  const canonical = new URL(asPath, siteUrl).href

  if (siteTitleStyle === 'snakeCase') {
    title = snakeCase(title)
  }

  if (siteTitleStyle === 'camelCase') {
    title = camelCase(title)
  }

  return <NextSeo canonical={canonical} title={title} {...props} />
}
