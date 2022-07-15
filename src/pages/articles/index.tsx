import { pick } from '@contentlayer/utils'
import { allArticles } from 'contentlayer/generated'
import { DocumentList } from 'features/Document/DocumentList'
import { DocumentListItem } from 'features/Document/DocumentListItem'
import Layout from 'layouts/Default'
import { InferGetStaticPropsType } from 'next'
import { Article } from 'types'

export default function ArticlesPage({
  articles
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout seo={{ title: 'articles' }}>
      <div className="w-full mt-8 max-w-none">
        <DocumentList documents={articles}>
          {(document) => <DocumentListItem {...document} />}
        </DocumentList>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const articles = (allArticles as unknown as Article[])
    .map((doc) =>
      pick(doc, ['path', 'title', 'excerpt', 'publishedAt', 'tags'])
    )
    .sort(
      (a, b) =>
        Number(new Date(b['publishedAt'])) - Number(new Date(a['publishedAt']))
    )

  return {
    props: {
      articles
    }
  }
}
