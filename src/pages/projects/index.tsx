import { pick } from '@contentlayer/utils'
import { allProjects } from 'contentlayer/generated'
import { DocumentList } from 'features/Document/DocumentList'
import { DocumentListItem } from 'features/Document/DocumentListItem'
import Layout from 'layouts/Default'
import { InferGetStaticPropsType } from 'next'
import { Project } from 'types'

export default function ProjectsPage({
  projects
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout seo={{ title: 'Projects' }}>
      <div className="w-full mt-8 max-w-none">
        <DocumentList documents={projects}>
          {(document) => <DocumentListItem {...document} />}
        </DocumentList>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const projects = (allProjects as unknown as Project[])
    .map((doc) =>
      pick(doc, ['path', 'title', 'excerpt', 'publishedAt', 'tags'])
    )
    .sort(
      (a, b) =>
        Number(new Date(b['publishedAt'])) - Number(new Date(a['publishedAt']))
    )

  return {
    props: {
      projects
    }
  }
}
