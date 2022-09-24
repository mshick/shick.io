import { allProjects, config } from 'contentlayer/generated'
import { ArticleBody } from 'features/Article/ArticleBody'
import { ArticleFooter } from 'features/Article/ArticleFooter'
import { ArticleHeader } from 'features/Article/ArticleHeader'
import { getArticle } from 'features/Article/utils'
import Layout from 'layouts/Article'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { NextSeoProps } from 'next-seo'
import { Project } from 'types'
import { getSingle } from 'utils/types'

export default function ProjectPage({
  project
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const {
    title,
    featuredImage,
    featuredImageUrl,
    excerpt,
    tags,
    publishedAt,
    updatedAt
  } = project

  const seo: NextSeoProps = {
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
      images: featuredImage
        ? [
            {
              url: new URL(featuredImageUrl, config.siteUrl).href,
              width: 850,
              height: 650,
              alt: featuredImage.alt ?? featuredImage.title ?? title
            }
          ]
        : null
    }
  }

  return (
    <Layout seo={seo}>
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
