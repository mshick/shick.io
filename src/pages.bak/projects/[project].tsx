import { ArticleBody } from '#/components/Article/ArticleBody'
import { ArticleFooter } from '#/components/Article/ArticleFooter'
import { ArticleHeader } from '#/components/Article/ArticleHeader'
import { getArticle } from '#/components/Article/utils'
import Layout from '#/layouts/Article'
import { getSeoProps } from '#/lib/utils/seo'
import { getSingle } from '#/lib/utils/types'
import { Project } from '#/types/types'
import { allProjects } from 'contentlayer/generated'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

export default function ProjectPage({
  project
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!project) {
    return
  }

  return (
    <Layout seo={getSeoProps(project)}>
      <div className="mb-8">
        <ArticleHeader {...project} />
      </div>
      <ArticleBody {...project} />
      <ArticleFooter {...project} />
    </Layout>
  )
}

export function getStaticPaths() {
  return {
    paths: allProjects.map((project) => ({
      params: {
        project: project.slug
      }
    })),
    fallback: false
  }
}

export function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = getSingle(params?.['project'])
  const project = slug && getArticle(slug, allProjects as unknown as Project[])

  return {
    notFound: !project,
    props: {
      project: project as any
    }
  }
}
