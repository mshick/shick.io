import ArticleContent from 'components/ArticleContent'
import ArticleFooter from 'components/ArticleFooter'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Main from 'components/Main'
import Seo from 'components/Seo'
import Sidebar from 'components/Sidebar'
import { siteUrl } from 'lib/config'
import { Container } from 'theme-ui'
import type { Article } from 'types'

export default function ArticleLayout({ article }: { article: Article }) {
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
    <>
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
        <Main>
          <ArticleContent {...article} />
          <ArticleFooter
            shareUrl={article.shareUrl}
            editUrl={article.editUrl}
            previous={article.previous}
            next={article.next}
          />
        </Main>
        <Footer />
      </Container>
    </>
  )
}
