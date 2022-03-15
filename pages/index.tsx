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
    <PageLayout seo={{ title: 'Create Next App' }}>
      <Component components={components} />

      <h1>
        Welcome to <a href="https://nextjs.org">Next.js!</a>
      </h1>

      <p>
        Get started by editing <code>pages/index.js</code>
      </p>

      <div>
        <a href="https://nextjs.org/docs">
          <h2>Documentation &rarr;</h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a href="https://nextjs.org/learn">
          <h2>Learn &rarr;</h2>
          <p>Learn about Next.js in an interactive course with quizzes!</p>
        </a>

        <a href="https://github.com/vercel/next.js/tree/canary/examples">
          <h2>Examples &rarr;</h2>
          <p>Discover and deploy boilerplate example Next.js projects.</p>
        </a>

        <a href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app">
          <h2>Deploy &rarr;</h2>
          <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
        </a>
      </div>
    </PageLayout>
  )
}

export async function getStaticProps() {
  const page = allPages.find((page) => page.slug === 'index')
  return { props: { page } }
}
