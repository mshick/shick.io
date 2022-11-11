import { ArticleBody } from '#/features/Article/ArticleBody'
import { ArticleFooter } from '#/features/Article/ArticleFooter'
import { ArticleHeader } from '#/features/Article/ArticleHeader'
import { getArticle } from '#/features/Article/utils'
import Layout from '#/layouts/Article'
import { Project } from '#/types/types'
import { getSeoProps } from '#/utils/seo'
import { getSingle } from '#/utils/types'
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
  const slug = getSingle(params?.project)
  const project = slug && getArticle(slug, allProjects as unknown as Project[])

  return {
    notFound: !Boolean(project),
    props: {
      project
    }
  }
}
