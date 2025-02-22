import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomepageList } from '#/components/Homepage/HomepageList';
import { MDXContent } from '#/components/MDXContent';
import { components } from '#/components/mdx';
import { getOptions, getPage, getPosts } from '#/content';

export const revalidate = 60;

export function generateMetadata(): Metadata {
  const page = getPage((value) => value.slug === 'index');
  return page?.meta ?? {};
}

export default function HomePage() {
  const page = getPage((value) => value.slug === 'index');

  if (!page) {
    return notFound();
  }

  const { links } = getOptions(['links']);
  const postsLink = links.find((link) => link.text === 'posts');

  const posts = getPosts(
    ['permalink', 'title', 'excerpt', 'excerptHtml', 'publishedAt', 'featured'],
    ['tags'],
    (p) => p.featured,
  );

  const bodyComponents = {
    ...components,
    HomepagePostsList: () => (
      <HomepageList
        collectionName="posts"
        heading={postsLink?.text ?? 'posts'}
        href={postsLink?.path ?? '/posts/'}
        documents={posts}
      />
    ),
  };

  return (
    <div className="prose prose-poop dark:prose-invert max-w-none">
      <MDXContent code={page.body} components={bodyComponents} />
    </div>
  );
}
