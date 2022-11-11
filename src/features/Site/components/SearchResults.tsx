import Loading from '#/components/Loading'
import { DocumentList } from '#/features/Document/DocumentList'
import { DocumentListItem } from '#/features/Document/DocumentListItem'
import {
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export type SearchResultsItem = {
  id: string
  title: string
  path: string
  excerpt: string
  publishedAt: string
}

export type SearchResultsProps = {
  isLoading: boolean
  isInitial: boolean
  items: SearchResultsItem[]
  onClickLink: () => void
}

export function SearchResults({
  isLoading,
  isInitial,
  items,
  onClickLink
}: SearchResultsProps) {
  return (
    <div className="flex">
      <div
        className="fixed inset-0 bg-white dark:bg-black z-20"
        aria-hidden="true"
      />
      <div className="flex flex-col w-full py-2 z-30">
        {isLoading && items.length === 0 && (
          <div className="p-8 flex items-center justify-center">
            <Loading />
          </div>
        )}

        {!isLoading && isInitial && (
          <div className="py-14 px-6 text-center text-sm sm:px-14">
            <DocumentMagnifyingGlassIcon
              className="mx-auto h-6 w-6"
              aria-hidden="true"
            />
            <p className="mt-4 font-semibold">Search the site</p>
            <p className="mt-2 text-gray-700 dark:text-gray-200">
              Two or more characters required.
            </p>
          </div>
        )}

        {!isLoading && !isInitial && items.length === 0 && (
          <div className="py-14 px-6 text-center text-sm sm:px-14">
            <ExclamationTriangleIcon
              className="mx-auto h-6 w-6"
              aria-hidden="true"
            />
            <p className="mt-4 font-semibold">No results found</p>
            <p className="mt-2 text-gray-700 dark:text-gray-200">
              We couldn’t find anything with that term.
            </p>
          </div>
        )}

        {items?.length > 0 && (
          <div className="w-full mt-4 max-w-none">
            <DocumentList documents={items}>
              {(document) => (
                <DocumentListItem
                  className="py-2 px-4"
                  onClickLink={onClickLink}
                  {...document}
                />
              )}
            </DocumentList>
          </div>
        )}
      </div>
    </div>
  )
}
