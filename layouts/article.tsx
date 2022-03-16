import type { Article, Page } from 'lib/types'
import { siteUrl } from 'lib/config'
import PageLayout from './page'
import ArticleContent from 'components/ArticleContent'

export default function ArticleLayout({
  article,
}: {
  article: Article | Page
}) {
  const { title, image, excerpt, tags, publishedAt, updatedAt } = article

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
    <PageLayout
      seo={{
        title,
        openGraph: {
          title,
          description: excerpt,
          type: 'article',
          article: {
            publishedTime: publishedAt,
            modifiedTime: updatedAt,
            tags: tags.map((tag) => tag.name),
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
        },
      }}
    >
      <ArticleContent {...article} />
    </PageLayout>
  )
}
