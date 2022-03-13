import type { NextSeoProps } from 'next-seo'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { siteUrl } from '../lib/config'

export default function Seo(props: NextSeoProps) {
  const { asPath } = useRouter()
  const canonical = new URL(asPath, siteUrl).href
  return <NextSeo canonical={canonical} {...props} />
}
