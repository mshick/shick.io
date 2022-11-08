import Link from '#/components/Link'
import { NavigationItem } from '../types'

export type NavigationMenuProps = {
  items: NavigationItem[]
}

export function NavigationMenu({ items }: NavigationMenuProps) {
  return (
    <>
      {items?.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className="first-of-type:-ml-2 p-2 outline-none focus:bg-blue-700 focus:text-white no-underline before:content-['['] before:p-0 after:content-[']'] after:p-0 hover:bg-blue-700 hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}
