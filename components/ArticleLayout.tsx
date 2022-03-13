import type { Article } from '.contentlayer/generated'
import { AppProvider } from 'components/context/app-context'
import SourceArticle from './source/source-article'
import { siteUrl } from 'lib/config'
import Seo from './Seo'
import Main from './Main'

export default function ArticleLayout({
  article: {
    body,
    excerpt,
    title,
    tags,
    isPrivate,
    author,
    image,
    readingTime,
    publishedAt,
    updatedAt,
  },
}: {
  article: Article
}) {
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
      <Main>
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
          readingTime={readingTime}
        />
      </Main>
    </AppProvider>
  )
}
