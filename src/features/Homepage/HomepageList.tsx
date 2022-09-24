import Link from 'components/Link'
import { DocumentTypes } from 'types'

export type HomepageListProps = {
  heading: string
  href: string
  documents: Pick<
    DocumentTypes,
    | 'path'
    | 'title'
    | 'excerpt'
    | 'publishedAt'
    | 'featured'
    | 'featuredImageUrl'
    | 'featuredImage'
  >[]
}

export function HomepageList({ heading, href, documents }: HomepageListProps) {
  return (
    <div className="my-4 -mx-4">
      <div className="mb-8">
        <h3 className="text-xl md:text-xl tracking-tight my-6 p-2 px-4 bg-black text-white dark:text-black dark:bg-white">
          Featured {heading}
        </h3>
        <div className="flex flex-col">
          {documents.map((doc) => (
            <Link
              key={doc.path}
              href={doc.path}
              className="block no-underline group hover:bg-blue-700 p-2 px-4"
            >
              <h2 className="mb-0 font-bold text-2xl group-hover:text-white">
                {doc.title}
              </h2>
              <div
                className="prose text-gray-700 dark:text-gray-100 group-hover:text-white"
                dangerouslySetInnerHTML={{ __html: doc.excerpt }}
              />
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
    </div>
  )
}
