import { Iframe } from '#/components/Iframe'
import { Image } from '#/components/Image'
import { Link } from '#/components/Link'
import { type MDXComponents } from 'mdx/types'

export const components: MDXComponents = {
  a: Link,
  img: Image,
  iframe: Iframe
}
