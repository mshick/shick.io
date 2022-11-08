import Link from '#/components/Link'
import { NavigationItem } from '../types'

export type MobileMenuProps = {
  items: NavigationItem[]
}

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
            className="py-2 px-4 text-lg  hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-700"
          >
            <Link
              href={item.path}
              className="block no-underline before:content-['['] before:p-0 after:content-[']'] after:p-0 hover:bg-blue-700 hover:text-white"
            >
              {item.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
