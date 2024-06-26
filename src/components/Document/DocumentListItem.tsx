import Link from '#/components/Link'
import { DocumentTypes } from '#/types/types'

export type DocumentListItemProps = Pick<
  DocumentTypes,
  'title' | 'excerpt' | 'path'
> & {
  className?: string
  onClickLink?: () => void
}

export function DocumentListItem({
  title,
  excerpt,
  path,
  className,
  onClickLink
}: DocumentListItemProps) {
  onClickLink =
    onClickLink ??
    (() => {
      // empty
    })

  return (
    <Link
      href={path}
      onClick={onClickLink}
      className={`block no-underline group hover:bg-blue-700 p-2 px-4 ${
        className ?? ''
      }`}
    >
      <h2 className="mb-0 font-bold text-2xl group-hover:text-white">
        {title}
      </h2>
      {excerpt && (
        <div
          className="prose text-gray-700 dark:text-gray-100 group-hover:text-white"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      )}
    </Link>
  )
}
