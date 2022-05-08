import components from 'components/MDXComponents'
import { allPages } from 'contentlayer/generated'
import PageLayout from 'layouts/Page'
import { InferGetStaticPropsType } from 'next'
import { useMDXComponent } from 'next-contentlayer/hooks'

export default function AboutPage({
  page
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(page.body.code)

  return (
    <PageLayout seo={{ title: 'about' }}>
      <Component components={components} />
    </PageLayout>
  )
}

export async function getStaticProps() {
  const page = allPages.find((page) => page.slug === 'about')
  return { props: { page } }
}
