import type { PropsWithCallableChildren } from '#/types/types'
import type { Document } from '@/content'

type DocumentListItem = Pick<
  Document,
  'permalink' | 'title' | 'excerptHtml' | 'publishedAt'
>

export type DocumentListProps = {
  documents: DocumentListItem[]
}

export function DocumentList({
  documents,
  children
}: PropsWithCallableChildren<DocumentListProps, DocumentListItem>) {
  return (
    <ul className="space-y-6">
      {documents.map((doc) => (
        <li key={doc.permalink} className="space-y-1">
          {children(doc)}
        </li>
      ))}
    </ul>
  )
}
