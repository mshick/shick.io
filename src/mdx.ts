import Iframe from '#/components/Iframe'
import Image from '#/components/Image'
import Link from '#/components/Link'
import { MDXComponents } from 'mdx/types'

export const components: MDXComponents = {
  a: Link,
  img: Image,
  iframe: Iframe
  // qrcode: Qrcode
}
