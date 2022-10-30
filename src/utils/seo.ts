import { config } from 'contentlayer/generated'
import { NextSeoProps } from 'next-seo'
import { DocumentTypes } from 'types'

type SeoDocument = Pick<
  DocumentTypes,
  | 'title'
  | 'excerpt'
  | 'publishedAt'
  | 'updatedAt'
  | 'tags'
  | 'featuredImage'
  | 'featuredImageUrl'
>

type SeoOptions = {
  type: string
}

export function getSeoProps(
  {
    title,
    excerpt,
    publishedAt,
    updatedAt,
    tags,
    featuredImage,
    featuredImageUrl
  }: SeoDocument,
  options?: SeoOptions
): NextSeoProps {
  const type = options?.type ?? 'article'

  return {
    title,
    openGraph: {
      title,
      description: excerpt,
      type,
      article: {
        publishedTime: publishedAt,
        modifiedTime: updatedAt,
        tags: tags.map((tag) => tag.name)
      },
      images: featuredImage
        ? [
            {
              url: new URL(featuredImageUrl, config.siteUrl).href,
              width: featuredImage.asset.width,
              height: featuredImage.asset.height,
              alt: featuredImage.alt ?? featuredImage.title ?? title
            }
          ]
        : undefined
    }
  }
}
