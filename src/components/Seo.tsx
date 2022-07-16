import { config } from 'contentlayer/generated'
import { NextSeo, NextSeoProps } from 'next-seo'
import { useRouter } from 'next/router'

function getCanonicalUrl(path, siteUrl): string {
  return new URL(path, siteUrl).href
}

export const Seo = ({ title, ...props }: NextSeoProps) => {
  const { asPath } = useRouter()
  const canonical = getCanonicalUrl(asPath, config.siteUrl)
  return <NextSeo canonical={canonical} title={title} {...props} />
}

export default Seo
