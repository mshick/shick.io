import { siteUrl } from 'lib/config'
import type { Article, Page } from 'lib/types'
import { Container } from 'theme-ui'
import ArticleContent from '../components/ArticleContent'
import Header from '../components/Header'
import Main from '../components/Main'
import NavigationButton from '../components/NavigationButton'
import Seo from '../components/Seo'
import Sidebar from '../components/Sidebar'
import { AppProvider } from '../contexts/app-context'

export default function ArticleLayout({
  article
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
    <AppProvider>
      <Seo
        {...{
          title,
          openGraph: {
            title,
            description: excerpt,
            type: 'article',
            article: {
              publishedTime: publishedAt,
              modifiedTime: updatedAt,
              tags: tags.map((tag) => tag.name)
            },
            images: image
              ? [
                  {
                    url: new URL(image.url, siteUrl).href,
                    width: 850,
                    height: 650,
                    alt: image.alt ?? image.title ?? title
                  }
                ]
              : null
          }
        }}
      />
      <Container>
        <Header />
        <Sidebar />
        <NavigationButton />
        <Main>
          <ArticleContent {...article} />
        </Main>
      </Container>
    </AppProvider>
  )
}
