import Link from 'next/link';
import type { Post, Related, Taxonomy } from '#/content';
import { standardDate } from '#/lib/utils/text';
import { Divider } from '../Divider';

export type PostFooterProps = Pick<
  Post,
  'historyUrl' | 'shareUrl' | 'updatedAt'
> &
  Related &
  Taxonomy;

function PostFooterMeta({
  updatedAt,
  historyUrl,
  tags,
}: Pick<PostFooterProps, 'updatedAt' | 'historyUrl' | 'tags'>) {
  return (
    <div className="flex flex-col items-start sm:items-center sm:flex-row-reverse justify-between gap-8 sm:gap-4">
      {updatedAt && (
        <div className="flex flex-row sm:justify-end sm:shrink-0 sm:w-1/2">
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
        <ul className="list-none flex flex-row gap-x-4 gap-y-2 flex-wrap">
          {tags.map((tag) => (
            <li key={tag.permalink} className="leading-none">
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
  );
}

function PostFooterRelated({ related }: Related) {
  return (
    <div id="related-posts">
      <h2 className="text-2xl mb-4">Related</h2>
      <ul className="space-y-2">
        {related?.map(({ permalink, publishedAt, title }) => (
          <li key={permalink}>
            <Link
              href={permalink}
              className="flex flex-col items-start sm:items-center sm:flex-row-reverse justify-between sm:gap-4 no-underline hover:bg-blue-700 hover:text-white"
            >
              <time className="text-xs shrink-0" dateTime={publishedAt}>
                {standardDate(publishedAt)}
              </time>
              <span>{title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PostFooter(post: PostFooterProps) {
  return (
    <footer id="post-footer" className="mt-8">
      {post.updatedAt || post.tags ? <PostFooterMeta {...post} /> : null}

      <Divider className="my-8" />

      {post.related ? <PostFooterRelated related={post.related} /> : null}

      <div className="mb-10" />
    </footer>
  );
}
