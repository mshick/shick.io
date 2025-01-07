import { Link } from '#/components/Link';
import type { DocumentTypes, PropsWithCallableChildren } from '#/types/types';

type Document = Pick<
  DocumentTypes,
  '_id' | 'slug' | 'path' | 'title' | 'excerpt' | 'publishedAt'
>;

export type FeaturedArticlesProps = {
  documents: Document[];
};

export function FeaturedArticles({
  documents,
}: PropsWithCallableChildren<FeaturedArticlesProps, Document>) {
  return (
    <ul className="flex flex-col m-0 p-0 list-none">
      {documents.map(({ _id, path, title, excerpt }) => (
        <li key={_id} className="mb-3">
          <Link href={path} className="no-underline">
            <div>
              <h2 className="mb-0 font-bold text-2xl">{title}</h2>
              {excerpt && (
                <div
                  className="-mt-2 prose-tufte"
                  dangerouslySetInnerHTML={{ __html: excerpt }}
                />
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
