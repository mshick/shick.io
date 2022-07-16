import { pick } from '@contentlayer/utils'
import Link from 'components/Link'
import { allArticles, allPages } from 'contentlayer/generated'
import firstName from 'features/Ascii/firstName.txt'
import lastName from 'features/Ascii/lastName.txt'
import picture from 'features/Ascii/portrait.txt'
import Layout from 'layouts/Page'
import { InferGetStaticPropsType } from 'next'
import { Article, Page } from 'types'

export default function IndexPage({
  page,
  featuredArticles
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout seo={{ defaultTitle: page.title }}>
      <div className="flex flex-col-reverse sm:flex-row sm:gap-10 my-4">
        <div className="flex flex-col gap-4 items-center sm:items-start md:justify-center">
          <div className="flex flex-row gap-4 sm:flex-row sm:gap-2 sm:mx-0 text-[5px] sm:text-[6px] lg:text-[7px]">
            <pre>{firstName}</pre>
            <pre>{lastName}</pre>
          </div>
          <div className="text-xs max-w-[18rem]">
            <p>
              Software engineer and sometimes manager of software engineers.
              Building API tools at <a href="https://takeshape.io">TakeShape</a>
              .
            </p>
          </div>
        </div>
        <div className="flex mx-auto sm:ml-auto sm:mr-0">
          <pre className="text-[1.5px] md:text-[2px] lg:text-[2.5px] leading-none">
            {picture}
          </pre>
        </div>
      </div>

      <div className="my-4">
        <div className="mb-8">
          <h3 className="font-bold text-xl md:text-2xl tracking-tight my-4 text-black dark:text-white">
            Featured Articles
          </h3>
          <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1">
            {featuredArticles.map((article) => (
              <Link
                key={article.path}
                href={article.path}
                className="flex flex-row gap-2 items-center p-4 hover:bg-blue-700 focus:bg-blue-700 focus:first-letter:ring-0 outline-none hover:text-white focus:text-white first-letter:cursor-pointer hp-featured hp-featured-black dark:hp-featured-white md:hp-featured-md hover:hp-featured-white dark:hp-featured-white dark:hover:hp-featured-black focus:hp-featured-black dark:focus:hp-featured-black min-h-[10rem]"
              >
                <div className="mb-0 font-bold text-xl group-hover:text-white">
                  {article.title}
                </div>
                <div className="ml-auto whitespace-nowrap">-&gt;</div>
              </Link>
            ))}
          </div>
          <div className="my-4">
            <Link href="/articles/">Read all articles -&gt;</Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const page = (allPages as unknown as Page[]).find(
    (page) => page.slug === 'index'
  )

  const featuredArticles = (allArticles as unknown as Article[])
    .map((doc) =>
      pick(doc, ['path', 'title', 'excerpt', 'publishedAt', 'featured'])
    )
    .sort(
      (a, b) =>
        Number(new Date(b['publishedAt'])) - Number(new Date(a['publishedAt']))
    )
    .filter((article) => article.featured)

  return {
    props: {
      page,
      featuredArticles
    }
  }
}
