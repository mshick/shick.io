import { standardDate } from '#/utils/text'
import type { Post, Tag } from '@/content'
import Link from 'next/link'

export type PostFooterProps = Pick<
  Post,
  'historyUrl' | 'shareUrl' | 'related' | 'updatedAt'
> & {
  tags: Pick<Tag, 'name' | 'slug' | 'permalink'>[]
}

function PostFooterMeta({
  updatedAt,
  historyUrl,
  tags
}: Pick<PostFooterProps, 'updatedAt' | 'historyUrl' | 'tags'>) {
  return (
    <div className="flex flex-col items-start sm:items-center sm:flex-row-reverse justify-between gap-2 sm:gap-4">
      {updatedAt && (
        <div className="flex flex-row">
          <time className="text-xs" dateTime={updatedAt}>
            last updated:{' '}
            <a
              href={historyUrl}
              className="underline decoration-dotted hover:bg-blue-700 hover:text-white"
            >
              {standardDate(updatedAt)}
            </a>
          </time>
        </div>
      )}
      {tags ? (
        <ul className="list-none flex flex-row gap-4">
          {tags.map((tag) => (
            <li key={tag.slug} className="leading-none">
              <Link
                href={tag.permalink}
                className="text-xs no-underline before:content-['#'] hover:bg-blue-700 hover:text-white"
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function PostFooterActions({ shareUrl }: Pick<PostFooterProps, 'shareUrl'>) {
  const encodedShareUrl = encodeURIComponent(shareUrl)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-8">
        {shareUrl ? (
          <Link
            href={`https://x.com/intent/post?url=${encodedShareUrl}`}
            className="block no-underline hover:bg-blue-700 hover:text-white"
          >
            (share on x)
          </Link>
        ) : null}

        {/* {editUrl ? (
          <Link
            href={editUrl}
            className="block no-underline hover:bg-blue-700 hover:text-white"
          >
            (fork on github)
          </Link>
        ) : null} */}
      </div>
    </div>
  )
}

function PostFooterRelated({
  related
}: {
  related: NonNullable<Post['related']>
}) {
  return (
    <div id="related-posts">
      <h2 className="text-2xl mb-4">Related posts</h2>
      <ul className="space-y-2 mb-8">
        {related.map(({ permalink, publishedAt, title }) => (
          <>
            <li key={permalink}>
              <Link
                href={permalink}
                className="flex flex-col items-start sm:items-center sm:flex-row-reverse justify-between sm:gap-4 no-underline hover:bg-blue-700 hover:text-white"
              >
                <time className="text-xs flex-shrink-0" dateTime={publishedAt}>
                  {standardDate(publishedAt)}
                </time>
                <span>{title}</span>
              </Link>
            </li>
          </>
        ))}
      </ul>
    </div>
  )
}

export function PostFooter(post: PostFooterProps) {
  return (
    <footer id="post-footer">
      {post.updatedAt || post.tags ? <PostFooterMeta {...post} /> : null}

      <hr className="my-8" />

      {post.related ? <PostFooterRelated related={post.related} /> : null}

      <hr className="my-8" />

      {post.shareUrl ? <PostFooterActions {...post} /> : null}
    </footer>
  )
}
