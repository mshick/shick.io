import { allPages } from 'contentlayer/generated'
import { components } from 'features/Mdx'
import Layout from 'layouts/Page'
import { InferGetStaticPropsType } from 'next'
import { useMDXComponent } from 'next-contentlayer/hooks'

export default function AboutPage({
  page
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(page.body.code)

  return (
    <Layout seo={{ title: 'about' }}>
      <Component components={components} />
    </Layout>
  )
}

export async function getStaticProps() {
  const page = allPages.find((page) => page.slug === 'about')
  return { props: { page } }
}
