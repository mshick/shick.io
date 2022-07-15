import { DocumentTypes, PropsWithCallableChildren } from 'types'

type Document = Pick<
  DocumentTypes,
  'path' | 'title' | 'excerpt' | 'publishedAt'
>

export type DocumentListProps = {
  documents: Document[]
}

export function DocumentList({
  documents,
  children
}: PropsWithCallableChildren<DocumentListProps, Document>) {
  return (
    <ul className="flex flex-col m-0 p-0 list-none">
      {documents.map((document) => (
        <li key={document.path} className="mb-6">
          {children(document)}
        </li>
      ))}
    </ul>
  )
}
