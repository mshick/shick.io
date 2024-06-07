import { Page, Post } from '#/.velite'
import Link from '#/components/Link'
import slug from 'slug'

export type HomepageListProps = {
  heading: string
  href: string
  documents: Pick<Post | Page, 'permalink' | 'title' | 'excerpt'>[]
}

export function HomepageList({ heading, href, documents }: HomepageListProps) {
  return (
    <section id={`list-${slug(heading)}`} className="my-4">
      <div className="mb-8">
        <h3 className="text-xl md:text-xl tracking-tight my-6 p-2 px-4 bg-black text-white dark:text-black dark:bg-white">
          {heading}
        </h3>
        <div className="flex flex-col">
          {documents.map((doc) => (
            <Link
              key={doc.permalink}
              href={doc.permalink}
              className="block no-underline group hover:bg-blue-700 p-2 px-4"
            >
              <h2 className="mb-0 font-bold text-2xl group-hover:text-white">
                {doc.title}
              </h2>
              {doc.excerpt && (
                <div
                  className="prose text-gray-700 dark:text-gray-100 group-hover:text-white"
                  dangerouslySetInnerHTML={{ __html: doc.excerpt }}
                />
              )}
            </Link>
          ))}
          <Link
            href={href}
            className="block no-underline group hover:bg-blue-700 p-2 px-4 my-4"
          >
            <div className="mb-0 group-hover:text-white">
              See all {heading} -&gt;
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
