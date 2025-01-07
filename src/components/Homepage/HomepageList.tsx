import slug from 'slug';
import { Link } from '#/components/Link';
import { DocumentList } from '../Document/DocumentList';
import { DocumentListItem } from '../Document/DocumentListItem';

export type HomepageListProps = {
  collectionName: string;
  heading: string;
  href: string;
  documents: DocumentListItem[];
};

export function HomepageList({
  collectionName,
  heading,
  href,
  documents,
}: HomepageListProps) {
  return (
    <section id={`list-${slug(heading)}`} className="not-prose py-3.5">
      <h2 className="text-3xl md:text-3xl mt-6 mb-5 capitalize tracking-tight">
        {heading}
      </h2>

      <DocumentList documents={documents}>
        {(item) => <DocumentListItem className="py-2 px-4" {...item} />}
      </DocumentList>

      <Link
        href={href}
        className="inline-block mt-6 no-underline group hover:bg-blue-700"
      >
        <div className="mb-0 group-hover:text-white">
          All {collectionName} -&gt;
        </div>
      </Link>
    </section>
  );
}
