import Iframe from '#/components/Iframe'
import Image from '#/components/Image'
import Link from '#/components/Link'
import Pre from '#/components/Pre'
import Qrcode from '#/components/Qrcode'
import { MDXComponents } from 'mdx/types'

export const components: MDXComponents = {
  a: Link,
  img: Image,
  iframe: Iframe,
  pre: Pre,
  qrcode: Qrcode
}
