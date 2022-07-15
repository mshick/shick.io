import { pick } from '@contentlayer/utils'
import { allDocuments } from 'contentlayer/generated'
import { DocumentList } from 'features/Document/DocumentList'
import { DocumentListItem } from 'features/Document/DocumentListItem'
import Layout from 'layouts/Default'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { DocumentTypes } from 'types'
import { getSingle } from 'utils/types'

export default function TagPage({
  tag,
  documents
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout seo={{ title: `tagged ${tag.name}` }}>
      <div className="w-full mt-8 max-w-none">
        <DocumentList documents={documents}>
          {(document) => <DocumentListItem {...document} />}
        </DocumentList>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = (allDocuments as unknown as DocumentTypes[])
    .filter((doc) => doc.tags && doc.tags.length)
    .flatMap((doc) => doc.tags.map((tag) => ({ params: { tag: tag.slug } })))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = getSingle(params.tag)

  const documents = (allDocuments as unknown as DocumentTypes[])
    .map((doc) =>
      pick(doc, ['path', 'title', 'excerpt', 'publishedAt', 'tags'])
    )
    .sort(
      (a, b) =>
        Number(new Date(b['publishedAt'])) - Number(new Date(a['publishedAt']))
    )
    .filter((doc) => doc.tags.some((tag) => tag.slug === slug))

  const tag = documents?.[0].tags.find((tag) => tag.slug === slug)

  return {
    notFound: documents.length === 0,
    props: {
      documents,
      tag
    }
  }
}