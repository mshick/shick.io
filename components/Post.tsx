import Head from 'next/head'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'

export const PostLayout = ({ title, publishedAt, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="max-w-2xl mx-auto py-16">
        <div className="text-center mb-6">
          <Link href="/">
            <a className="text-sm text-blue-700 uppercase font-bold text-center">
              Home
            </a>
          </Link>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-1">{title}</h1>
          <time dateTime={publishedAt} className="text-sm text-gray-600">
            {format(parseISO(publishedAt), 'LLLL d, yyyy')}
          </time>
        </div>
        <div className="cl-post-body" />
        {children}
      </article>
    </>
  )
}

export default PostLayout
