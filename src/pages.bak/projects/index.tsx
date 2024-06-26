import { DocumentList } from '#/components/Document/DocumentList'
import { DocumentListItem } from '#/components/Document/DocumentListItem'
import Layout from '#/layouts/Default'
import { Project } from '#/types/types'
import { pick } from '@contentlayer2/utils'
import { allProjects } from 'contentlayer/generated'
import { InferGetStaticPropsType } from 'next'

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

export function getStaticProps() {
  const projects = (allProjects as unknown as Project[])
    .map((doc) =>
      pick(doc, ['path', 'title', 'excerpt', 'publishedAt', 'tags'])
    )
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )

  return {
    props: {
      projects
    }
  }
}
