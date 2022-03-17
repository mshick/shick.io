import { allPages } from '.contentlayer/generated'
import { InferGetStaticPropsType } from 'next'
import { useMDXComponent } from 'next-contentlayer/hooks'
import PageLayout from 'layouts/page'
import components from 'components/MDXComponents'

export default function HomePage({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(page.body.code)

  return (
    <PageLayout seo={{ title: '' }}>
      <Component components={components} />
    </PageLayout>
  )
}

export async function getStaticProps() {
  const page = allPages.find((page) => page.slug === 'index')
  return { props: { page } }
}
