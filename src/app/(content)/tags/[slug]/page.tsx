import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import slug from 'slug';
import { DocumentList } from '#/components/Document/DocumentList';
import { DocumentListItem } from '#/components/Document/DocumentListItem';
import { DocumentListPagination } from '#/components/Document/DocumentListPagination';
import {
  filters,
  getDocuments,
  getDocumentsCount,
  getOptions,
  getTag,
  sorters,
} from '#/content';
import { getPagination } from '#/lib/utils/pagination';
import type { ServerProps } from '#/types/types';

export const revalidate = 60;

type Params = {
  slug: string;
};

export async function generateMetadata(
  props: ServerProps<Params>,
): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const tag = getTag(params.slug);

  if (!tag) {
    return {
      title: `#${params.slug}`,
    };
  }

  let title = `#${tag.name}`;

  const { currentPage } = getPagination(
    searchParams,
    getOptions(['collections']).collections?.find((c) => c.name === 'tag')
      ?.pagination ?? { per_page: 3 },
    getDocumentsCount(),
  );

  if (currentPage > 1) {
    title += ` (${currentPage})`;
  }

  return {
    title,
    description: tag.excerpt,
  };
}

export default async function TagPage(props: ServerProps<Params>) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const tag = getTag(params.slug);

  if (!tag) {
    return notFound();
  }

  const heading = `#${tag.name} (${tag.count.total})`;

  const { currentPage, perPage, pageOffset, totalPages } = getPagination(
    searchParams,
    getOptions(['collections']).collections?.find((c) => c.name === 'tag')
      ?.pagination ?? { per_page: 3 },
    getDocumentsCount(filters.none),
  );

  const documents = getDocuments(
    ['permalink', 'title', 'excerpt', 'excerptHtml', 'publishedAt'],
    ['tags'],
    (item) => item.tags?.includes(tag.name) ?? false,
    sorters.publishedAtDesc,
    perPage,
    pageOffset,
  );

  return (
    <>
      <div className="prose prose-sm prose-tufted dark:prose-invert max-w-none">
        <section id={`list-${slug(heading)}`} className="not-prose py-3.5">
          <h2 className="text-3xl md:text-3xl mt-6 mb-5 tracking-tight">
            {heading}
          </h2>
          <DocumentList documents={documents}>
            {(item) => <DocumentListItem className="py-2 px-4" {...item} />}
          </DocumentList>
        </section>
      </div>
      <DocumentListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        path={tag.permalink}
      />
    </>
  );
}
