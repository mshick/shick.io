import type { Page } from '.contentlayer/generated'
import { AppProvider } from 'components/context/app-context'
import { Seo } from '../Seo'
import { SourceArticle } from '../source/source-article'
import { siteUrl } from 'lib/config'

export const PageLayout = ({
  page: {
    body,
    excerpt,
    title,
    tags,
    isPrivate,
    author,
    image,
    publishedAt,
    updatedAt,
  },
}: {
  page: Page
}) => {
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
      <Seo
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
      />
      <SourceArticle
        title={title}
        tags={tags}
        publishedAt={publishedAt}
        updatedAt={updatedAt}
        author={author}
        isPrivate={isPrivate}
        image={image}
        // featuredImageUrl={featuredImageUrl}
        // embedded={transformImages(combinedEmbedded)}
        body={body}
      />
    </AppProvider>
  )
}
