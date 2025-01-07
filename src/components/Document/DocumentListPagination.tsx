import type { PropsWithChildren } from 'react';
import { classNames } from '#/lib/utils/classNames';

export type DocumentListPaginationProps = {
  path: string;
  currentPage: number;
  totalPages: number;
};

function PageLink({
  children,
  page,
  path,
  label,
  className,
}: PropsWithChildren<{
  page?: number;
  path: string;
  label: string;
  className: string;
}>) {
  return page ? (
    <a
      href={`${path}?page=${page}`}
      className={classNames(
        'inline-block group hover:bg-blue-700 hover:text-white no-underline select-none mr-4',
        className,
      )}
      aria-label={label}
    >
      {children}
    </a>
  ) : (
    <span
      className={classNames(
        'disabled inline-block group no-underline select-none mr-4 opacity-50',
        className,
      )}
      aria-label={label}
      aria-disabled="true"
    >
      {children}
    </span>
  );
}

export function DocumentListPagination({
  path,
  currentPage,
  totalPages,
}: DocumentListPaginationProps) {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <nav
      id="document-list-pagination"
      aria-label="Pagination"
      className="flex justify-center text-base mb-8 mt-auto"
    >
      <PageLink page={prevPage} path={path} label="Previous" className="mr-4">
        &lt;- Prev
      </PageLink>
      <PageLink
        page={nextPage > totalPages ? 0 : nextPage}
        path={path}
        label="Next"
        className="ml-4"
      >
        Next -&gt;
      </PageLink>
    </nav>
  );
}
