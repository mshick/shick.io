import type { PropsWithCallableChildren } from '#/types/types';
import type { DocumentListItem } from './DocumentListItem';

export type DocumentListProps<ListItem> = {
  documents: ListItem[];
};

export function DocumentList<
  ListItem extends DocumentListItem = DocumentListItem,
>({
  documents,
  children,
}: PropsWithCallableChildren<DocumentListProps<ListItem>, ListItem>) {
  return (
    <ul className="space-y-6">
      {documents.map((doc) => (
        <li key={doc.permalink} className="space-y-1">
          {children(doc)}
        </li>
      ))}
    </ul>
  );
}
