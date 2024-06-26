import Link from '#/components/Link'
import type { Page, Post } from '@/content'
import { format } from 'date-fns'
import slug from 'slug'

export type HomepageListProps = {
  collectionName: string
  heading: string
  href: string
  documents: Pick<
    Post | Page,
    'permalink' | 'title' | 'excerptHtml' | 'publishedAt'
  >[]
}

const formatDate = (date: string) => format(new Date(date), 'yyyy-MM-dd')

export function HomepageList({
  collectionName,
  heading,
  href,
  documents
}: HomepageListProps) {
  return (
    <section id={`list-${slug(heading)}`} className="not-prose py-3.5">
      <h2 className="text-3xl md:text-3xl mt-6 mb-5 capitalize tracking-tight">
        {heading}
      </h2>

      <ul className="space-y-6">
        {documents.map((doc) => (
          <li key={doc.permalink} className="space-y-1">
            <time className="block" dateTime={doc.publishedAt}>
              {formatDate(doc.publishedAt)}
            </time>
            <Link
              href={doc.permalink}
              className="no-underline inline-block hover:bg-blue-700 hover:text-white cursor-pointer"
            >
              <h2 className="text-xl">{doc.title}</h2>
            </Link>
            {doc.excerptHtml && (
              <div
                className="block prose text-gray-700 dark:text-gray-100"
                dangerouslySetInnerHTML={{ __html: doc.excerptHtml }}
              ></div>
            )}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className="inline-block mt-6 no-underline group hover:bg-blue-700"
      >
        <div className="mb-0 group-hover:text-white">
          All {collectionName} -&gt;
        </div>
      </Link>
    </section>
  )
}
