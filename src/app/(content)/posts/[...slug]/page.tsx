import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostBody } from '#/components/Post/PostBody';
import { PostFooter } from '#/components/Post/PostFooter';
import { PostHeader } from '#/components/Post/PostHeader';
import { getPost, getPosts, getRelated } from '#/content';
import type { ServerProps } from '#/types/types';

// export const revalidate = 300

type Params = {
  slug: string[];
};

export function generateStaticParams() {
  const posts = getPosts(['slug']);

  if (!posts) {
    return notFound();
  }

  return posts.map((post) => ({ slug: post.slug.split('/') }));
}

export async function generateMetadata(
  props: ServerProps<Params>,
): Promise<Metadata> {
  const params = await props.params;
  const post = getPost(params.slug.join('/'));

  if (!post) {
    return {
      title: params.slug.join('/'),
    };
  }

  return {
    title: post.title,
  };
}

export default async function PostPage(props: ServerProps<Params>) {
  const params = await props.params;
  const post = getPost(params.slug.join('/'), undefined, [
    'tags',
    'categories',
  ]);

  if (!post) {
    return notFound();
  }

  const related = getRelated(post);

  return (
    <article>
      <PostHeader {...post} />
      <PostBody {...post} />
      <PostFooter {...post} related={related} />
    </article>
  );
}
