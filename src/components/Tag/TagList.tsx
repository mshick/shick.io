import type { Tag } from '#/content';
import type { PropsWithCallableChildren } from '#/types/types';

export type TagListItem = Pick<Tag, 'permalink'>;

export type TagListProps<ListItem> = {
  tags: ListItem[];
};

export function TagList<ListItem extends TagListItem = TagListItem>({
  tags,
  children,
}: PropsWithCallableChildren<TagListProps<ListItem>, ListItem>) {
  return (
    <ul className="flex flex-col m-0 p-0 list-none">
      {tags.map((tag) => (
        <li key={tag.permalink}>{children(tag)}</li>
      ))}
    </ul>
  );
}
