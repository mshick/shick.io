import type { ComponentMap } from 'mdx-bundler/client'
import { components as themeUi } from 'theme-ui'
import { Image } from './Image'
import { Link } from './Link'

export const components: ComponentMap = {
  ...themeUi,
  a: Link,
  img: Image,
  code: (props) => {
    return <code {...props} />
  },
  pre: (props) => {
    return <pre {...props} />
  },
}
