import { allPages } from '.contentlayer/generated'
import components from 'components/components/MDXComponents'
import PageLayout from 'components/layouts/page'
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
