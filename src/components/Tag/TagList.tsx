import type { Tag } from '#/content'
import { PropsWithCallableChildren } from '#/types/types'

export type TagEntry = Pick<
  Tag,
  'permalink' | 'name' | 'excerpt' | 'excerptHtml' | 'publishedAt' | 'count'
>

export type TagListProps = {
  tags: TagEntry[]
}

export function TagList({
  tags,
  children
}: PropsWithCallableChildren<TagListProps, TagEntry>) {
  return (
    <ul className="flex flex-col m-0 p-0 list-none">
      {tags.map((tag) => (
        <li key={tag.permalink}>{children(tag)}</li>
      ))}
    </ul>
  )
}
