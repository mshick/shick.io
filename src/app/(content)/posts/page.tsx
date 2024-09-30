import { DocumentList } from '#/components/Document/DocumentList'
import { DocumentListHeader } from '#/components/Document/DocumentListHeader'
import { DocumentListItem } from '#/components/Document/DocumentListItem'
import { DocumentListPagination } from '#/components/Document/DocumentListPagination'
import { filters, getPosts, getPostsCount, sorters } from '#/content'
import { getSingle, isNumericString } from '#/lib/utils/types'
import { type ServerProps } from '#/types/types'
import slug from 'slug'

const PER_PAGE = 4
const HEADING = 'posts'

export const revalidate = 60

// export function generateMetadata(): Metadata {
//   const page = getPage((value) => value.slug === 'index')
//   return page?.meta ?? {}
// }

export default function PostsPage({ searchParams }: ServerProps) {
  const currentPage = isNumericString(getSingle(searchParams['page']))
    ? Number(searchParams['page'])
    : 1
  const perPage = PER_PAGE
  const pageOffset = perPage * (currentPage - 1)

  const posts = getPosts(
    ['permalink', 'title', 'excerpt', 'excerptHtml', 'publishedAt'],
    ['tags'],
    filters.none,
    sorters.publishedAtDesc,
    perPage,
    pageOffset
  )

  const totalPosts = getPostsCount(filters.none)

  const totalPages = Math.ceil(totalPosts / perPage)

  return (
    <>
      <div className="prose prose-sm prose-tufted dark:prose-invert max-w-none">
        <section id={`list-${slug(HEADING)}`} className="not-prose py-3.5">
          <DocumentListHeader heading={HEADING} />
          <DocumentList documents={posts}>
            {(item) => <DocumentListItem className="py-2 px-4" {...item} />}
          </DocumentList>
        </section>
      </div>
      <DocumentListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        path="/posts/"
      />
    </>
  )
}
