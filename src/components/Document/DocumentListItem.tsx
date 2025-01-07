'use client';

import { format } from 'date-fns';
import { Link } from '#/components/Link';
import type { Document } from '#/content';

const formatDate = (date: string) => format(new Date(date), 'yyyy-MM-dd');

export type DocumentListItem = Pick<
  Document,
  'title' | 'excerpt' | 'permalink' | 'publishedAt'
>;

export type DocumentListItemProps = DocumentListItem & {
  className?: string;
  onClickLink?: () => void;
};

export function DocumentListItem({
  title,
  excerpt,
  permalink,
  publishedAt,
  onClickLink,
}: DocumentListItemProps) {
  onClickLink =
    onClickLink ??
    (() => {
      // empty
    });

  return (
    <>
      <time className="block" dateTime={publishedAt}>
        {formatDate(publishedAt)}
      </time>
      <Link
        href={permalink}
        onClick={onClickLink}
        className="no-underline inline-block hover:bg-blue-700 hover:text-white cursor-pointer"
      >
        <h2 className="text-xl">{title}</h2>
      </Link>
      {excerpt && (
        <div
          className="block prose text-gray-700 dark:text-gray-100"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      )}
    </>
  );
}
