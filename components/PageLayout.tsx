import type { PropsWithChildren } from 'react'
import type { Page } from '.contentlayer/generated'
import { AppProvider } from 'contexts/app-context'
import Seo from './Seo'
import Main from './Main'
import SourceArticle from './ArticleContent'
import { siteUrl } from 'lib/config'

export default function PageLayout({
  children,
  title,
  description,
}: PropsWithChildren<{ title?: string; description?: string }>) {
  // const getSeoImage = () => {
  //   if (featuredImage) {
  //     return `${siteUrl}${featuredImage.childImageSharp.gatsbyImageData.images.fallback.src}`
  //   }

  //   if (featuredImageUrl) {
  //     return `${siteUrl}${featuredImageUrl.url.childImageSharp.gatsbyImageData.images.fallback.src}`
  //   }

  //   return siteImage
  // }

  // const combinedEmbedded = [
  //   ...(embeddedImages || []),
  //   ...(embeddedImageUrls || [])
  // ].filter(n => n)

  return (
    <AppProvider>
      {/* <Seo
        title={title}
        openGraph={{
          title,
          description: excerpt,
          type: 'article',
          article: {
            publishedTime: publishedAt,
            modifiedTime: updatedAt,
            tags,
          },
          images: image
            ? [
                {
                  url: new URL(image.url, siteUrl).href,
                  width: 850,
                  height: 650,
                  alt: image.alt ?? image.title ?? title,
                },
              ]
            : null,
        }}
      /> */}
      <Main>{children}</Main>
    </AppProvider>
  )
}
