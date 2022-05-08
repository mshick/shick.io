import NextLink from 'next/link'
import { Link as ThemeUILink } from 'theme-ui'

export default function Link({ href, children, ...rest }) {
  if (href.match(/^(http|https):/g)) {
    return (
      <ThemeUILink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </ThemeUILink>
    )
  }

  if (href.match(/#/gi)) {
    return (
      <ThemeUILink href={href} {...rest}>
        {children}
      </ThemeUILink>
    )
  }

  return (
    <NextLink href={href} passHref>
      <ThemeUILink {...rest}>{children}</ThemeUILink>
    </NextLink>
  )
}
