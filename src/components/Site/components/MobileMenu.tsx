import { Link } from '#/components/Link';
import type { Options } from '#/content';
import { classNames } from '#/lib/utils/classNames';

export type MobileMenuProps = {
  items: Options['links'];
};

export function MobileMenu({ items }: MobileMenuProps) {
  return (
    <div className="flex">
      <div
        className="fixed inset-0 bg-white dark:bg-black z-10"
        aria-hidden="true"
      />
      <div className="flex flex-col w-full py-2 z-20">
        {items?.map((item) => (
          <div
            key={item.path}
            className="py-2 px-4 text-lg  hover:text-white hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-blue-700"
          >
            <Link
              href={item.path}
              className={classNames(
                item.current ? `before:content-[">/"] -ml-[11px]` : '',
                'before:content-["/"] after:content-["/"] block no-underline before:p-0 after:p-0 hover:bg-blue-700 hover:text-white',
              )}
            >
              {item.text}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
