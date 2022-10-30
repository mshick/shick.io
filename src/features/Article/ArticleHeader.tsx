import Link from 'components/Link'
import { format } from 'date-fns'
import { Article } from 'types'

const formatDate = (date: string) => format(new Date(date), 'yyyy-MM-dd')

export type ArticleHeaderProps = Pick<
  Article,
  'publishedAt' | 'updatedAt' | 'tags' | 'readingTime' | 'title' | 'author'
>

export function ArticleHeader({
  publishedAt,
  updatedAt,
  tags,
  readingTime,
  title,
  author
}: ArticleHeaderProps) {
  return (
    <div className="prose prose-tufted-bbs prose-tufted-sidenotes md:prose-tufted-sidenotes-lg dark:prose-tufted-bbs-invert">
      <div className="w-full md:clear-right md:float-right md:w-[18.5%]">
        <span className="text-xs md:block">
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </span>
        {updatedAt && (
          <span className="text-xs mt-2 ml-2 before:content-['::'] before:mr-2 md:before:content-[initial] md:before:mr-2 md:ml-0 md:block ">
            <time
              dateTime={updatedAt}
              className="after:content-['(modify)'] md:after:content-['(mod)'] after:ml-1"
            >
              {formatDate(updatedAt)}
            </time>
          </span>
        )}
        {readingTime ? (
          <span className="text-xs md:mt-4 ml-2 before:content-['::'] before:mr-2 md:before:content-[initial] md:before:mr-0 md:ml-0 md:block">
            {readingTime.text}
          </span>
        ) : null}
        {tags ? (
          <ul className="md:mt-4 ml-0 p-0 block text-left list-none">
            {tags.map((tag) => {
              return (
                <li
                  className="inline-block m-0 pl-0 text-xs before:content-[initial]"
                  key={tag.slug}
                >
                  <Link
                    href={tag.path}
                    className="ml-0 mr-2 no-underline before:content-['#'] hover:bg-blue-700 hover:text-white"
                  >
                    {tag.slug}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
      <div className="w-full md:w-[67.5%]">
        <h1 className="title xl:max-w-[80%]">{title}</h1>
        {author && <p className="lead">{author}</p>}
      </div>
    </div>
  )
}
