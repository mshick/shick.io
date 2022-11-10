import NextLink, { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'

export const Link = ({
  children,
  href,
  as,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps) => {
  if (!href || href === '#') {
    // Don't try to create bad NextLinks
    return <a {...props}>{children}</a>
  }

  return (
    <NextLink href={href} as={as} {...props}>
      {children}
    </NextLink>
  )
}

export default Link
