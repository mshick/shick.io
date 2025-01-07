import type { Metadata } from 'next';
import slug from 'slug';
import { Link } from '#/components/Link';
import { TagList } from '#/components/Tag/TagList';
import { getTags } from '#/content';

const HEADING = 'Tags';

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return {
    title: HEADING,
  };
}

export default function TagsPage() {
  const heading = HEADING;

  const tags = getTags([
    'permalink',
    'name',
    'excerpt',
    'publishedAt',
    'count',
  ]);

  return (
    <section id={`list-${slug(heading)}`} className="not-prose py-3.5">
      <h2 className="text-3xl md:text-3xl mt-6 mb-5 capitalize tracking-tight">
        {heading} ({tags.length})
      </h2>

      <TagList tags={tags}>
        {({ permalink, name, count }) => (
          <>
            <Link href={permalink}>#{name}</Link> ({count.total})
          </>
        )}
      </TagList>
    </section>
  );
}
