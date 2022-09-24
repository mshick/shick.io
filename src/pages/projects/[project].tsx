import { allProjects } from 'contentlayer/generated'
import { ArticleBody } from 'features/Article/ArticleBody'
import { ArticleFooter } from 'features/Article/ArticleFooter'
import { ArticleHeader } from 'features/Article/ArticleHeader'
import { getArticle } from 'features/Article/utils'
import Layout from 'layouts/Article'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { Project } from 'types'
import { getSeoProps } from 'utils/seo'
import { getSingle } from 'utils/types'

export default function ProjectPage({
  project
}: InferGetStaticPropsType<typeof getStaticProps>) {
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

export async function getStaticPaths() {
  return {
    paths: allProjects.map((project) => ({
      params: {
        project: project.slug
      }
    })),
    fallback: false
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = getSingle(params.project)
  const project = getArticle(slug, allProjects as unknown as Project[])

  return {
    notFound: !Boolean(project),
    props: {
      project
    }
  }
}
