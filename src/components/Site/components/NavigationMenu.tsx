import { Link } from '#/components/Link';
import type { Options } from '#/content';
import { classNames } from '#/lib/utils/classNames';

export type NavigationMenuProps = {
  items: Options['links'];
};

export function NavigationMenu({ items }: NavigationMenuProps) {
  return (
    <>
      {items?.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={classNames(
            item.current ? 'bg-gray-700 text-white' : '',
            'before:content-["/"] after:content-["/"] first-of-type:ml-0 m-2 p-0 outline-hidden no-underline before:p-0 after:p-0 hover:bg-blue-700 hover:text-white',
          )}
        >
          {item.text}
        </Link>
      ))}
    </>
  );
}
