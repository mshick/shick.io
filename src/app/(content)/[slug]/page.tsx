import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXContent } from '#/components/MDXContent';
import { getPage } from '#/content';
import type { ServerProps } from '#/types/types';

export const revalidate = 60;

type Params = {
  slug: string;
};

export function generateMetadata(): Metadata {
  const page = getPage((value) => value.slug === 'index');
  return page?.meta ?? {};
}

export default async function PagePage(props: ServerProps<Params>) {
  const params = await props.params;
  const page = getPage((value) => value.slug === params.slug);

  if (!page) {
    return notFound();
  }

  return (
    <div className="prose prose-sm prose-tufted dark:prose-invert max-w-none">
      <MDXContent code={page.body} />
    </div>
  );
}
