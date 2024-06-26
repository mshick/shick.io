import { HomepageList } from '#/components/Homepage/HomepageList'
import { getPosts } from '@/content'

export const revalidate = 60

// export function generateMetadata(): Metadata {
//   const page = getPage((value) => value.slug === 'index')
//   return page?.meta ?? {}
// }

export default function PostsPage() {
  const posts = getPosts(
    ['permalink', 'title', 'excerpt', 'excerptHtml', 'publishedAt'],
    ['tags']
  )

  return (
    <div className="prose prose-sm prose-tufted dark:prose-invert max-w-none">
      <HomepageList
        collectionName="posts"
        heading={'posts'}
        href={'/posts/'}
        documents={posts}
      />
    </div>
  )
}
