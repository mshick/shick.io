import Image from 'components/Image'
import Link from 'components/Link'
import { ComponentMap } from 'mdx-bundler/client'
import { isReactElement } from 'utils/types'

export const components: ComponentMap = {
  a: Link,
  img: Image,
  iframe: ({ ...props }) => {
    return <iframe className="w-full aspect-[16/9]" {...props} />
  },
  qrcode: ({ children }) => {
    return <div className="qrcode">{children}</div>
  },
  pre: ({ ...props }) => {
    let className = props.className ?? ''

    if (isReactElement(props.children)) {
      const childClassName = props.children.props?.className ?? ''
      const [, languageName] = childClassName.match(/language-(\w+)/)
      if (languageName) {
        className = `${className} ${languageName}`.trim()
      }
    }

    return <pre className={className} {...props} />
  }
}
