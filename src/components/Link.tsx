import NextLink from 'next/link';
import type { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';

export const Link = ({
  children,
  href,
  ...props
}: DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) => {
  if (!href || href === '#') {
    // Don't try to create bad NextLinks
    return <a {...props}>{children}</a>;
  }

  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
};
