import { DocumentTypes, PropsWithCallableChildren, Tag } from '#/types/types'

export type TagEntry = {
  tag: Tag
  docs: Pick<
    DocumentTypes,
    'path' | 'title' | 'excerpt' | 'publishedAt' | 'tags'
  >[]
}

export type TagListProps = {
  tags: TagEntry[]
}

export function TagList({
  tags,
  children
}: PropsWithCallableChildren<TagListProps, TagEntry>) {
  return (
    <ul className="flex flex-col m-0 p-0 list-none">
      {tags.map(({ tag, docs }) => (
        <li key={tag.slug}>{children({ tag, docs })}</li>
      ))}
    </ul>
  )
}
