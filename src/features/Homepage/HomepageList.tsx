import Link from 'components/Link'
import { DocumentTypes } from 'types'

export type HomepageListProps = {
  heading: string
  href: string
  documents: Pick<
    DocumentTypes,
    'path' | 'title' | 'excerpt' | 'publishedAt' | 'featured'
  >[]
}

export function HomepageList({ heading, href, documents }: HomepageListProps) {
  return (
    <div className="my-4">
      <div className="mb-8">
        <h3 className="font-bold text-xl md:text-2xl tracking-tight my-4 text-black dark:text-white hover:bg-blue-700 hover:text-white inline-block">
          <Link href={href}>{heading} -&gt;</Link>
        </h3>
        <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 md:grid-rows-1">
          {documents.map((doc) => (
            <Link
              key={doc.path}
              href={doc.path}
              className="flex flex-row gap-2 items-center p-4 hover:bg-blue-700 focus:bg-blue-700 focus:first-letter:ring-0 outline-none hover:text-white focus:text-white first-letter:cursor-pointer hp-featured hp-featured-black dark:hp-featured-white md:hp-featured-md hover:hp-featured-white dark:hp-featured-white dark:hover:hp-featured-black focus:hp-featured-black dark:focus:hp-featured-black min-h-[10rem]"
            >
              <div className="mb-0 font-bold text-xl group-hover:text-white">
                {doc.title}
              </div>
              <div className="ml-auto whitespace-nowrap">-&gt;</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
