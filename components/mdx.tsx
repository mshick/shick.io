import type { ComponentMap } from 'mdx-bundler/client'
import { Fragment } from 'react'
import { components as themeUi } from 'theme-ui'
import { Image } from './Image'
import { Link } from './Link'
import Prism from '@theme-ui/prism'

export const components: ComponentMap = {
  ...themeUi,
  a: Link,
  img: Image,
  code: Prism,
  pre: ({ children }) => {
    return <Fragment>{children}</Fragment>
  },
}
