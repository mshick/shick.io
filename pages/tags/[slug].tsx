import type { InferGetStaticPropsType } from 'next'
import type { DocumentTypes } from 'lib/types'
import { pick } from '@contentlayer/utils'
import { Flex, Box } from 'theme-ui'
import { allDocuments } from '.contentlayer/generated'
import PageLayout from 'layouts/page'
import ArticleListItem from 'components/ArticleListItem'

export default function TagPage({
  documents
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageLayout seo={{ title: 'Tagged' }}>
      <Flex
        as="ul"
        sx={{ flexDirection: 'column', m: 0, p: 0, listStyleType: 'none' }}
      >
        {documents.map((article) => (
          <Box as="li" key={article.slug}>
            <ArticleListItem {...article} />
          </Box>
        ))}
      </Flex>
    </PageLayout>
  )
}

export async function getStaticPaths() {
  const paths = (allDocuments as unknown as DocumentTypes[])
    .filter((doc) => doc.tags && doc.tags.length)
    .flatMap((doc) => doc.tags.map((tag) => ({ params: { slug: tag.slug } })))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const documents = (allDocuments as unknown as DocumentTypes[])
    .filter((doc) => doc.tags.some((tag) => tag.slug === params.slug))
    .map((doc) =>
      pick(doc, ['slug', 'path', 'title', 'excerpt', 'publishedAt', 'tags'])
    )
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )

  const tag = documents?.[0].tags.find((tag) => tag.slug === params.slug)

  return { props: { documents, tag } }
}
