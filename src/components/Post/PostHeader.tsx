import Link from 'next/link';
import type { Post, Tag } from '#/content';
import { standardDate } from '#/lib/utils/text';

export type PostHeaderProps = Pick<
  Post,
  'publishedAt' | 'updatedAt' | 'title' | 'author' | 'metadata'
> & {
  tags?: Pick<Tag, 'name' | 'slug' | 'permalink'>[];
};

export function PostHeader({ publishedAt, metadata, title }: PostHeaderProps) {
  return (
    <header id="post-header" className="space-y-3">
      <Link
        href={{
          pathname: '/posts/',
        }}
        className="group flex flex-row gap-1 whitespace-nowrap text-xs mt-4"
      >
        <span>&lt;-</span>
        <span className="group-hover:bg-blue-700 group-hover:text-white">
          Back to all posts
        </span>
      </Link>
      <h1 id="title" className="text-3xl">
        {title}
      </h1>
      <div className="text-sm">
        <span>
          <time dateTime={publishedAt}>{standardDate(publishedAt)}</time>
        </span>
        {metadata.readingTime ? (
          <span className="ml-2 before:content-['::'] before:mr-2">
            {metadata.readingTime} minute read
          </span>
        ) : null}
      </div>
    </header>
  );
}
