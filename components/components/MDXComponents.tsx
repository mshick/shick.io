import type { ComponentMap } from 'mdx-bundler/client'
import { Box, components as themeUi } from 'theme-ui'
import Image from './Image'
import Link from './Link'

const MDXComponents: ComponentMap = {
  ...themeUi,
  a: Link,
  // @ts-expect-error
  img: Image,
  code: (props) => {
    return <code {...props} />
  },
  pre: (props) => {
    return <pre {...props} />
  },
  section: ({ ref, ...props }) => {
    return <Box as="section" variant="styles.section" {...props} />
  },
  figure: ({ ref, className, ...props }) => {
    if (className === 'iframe-wrapper') {
      return <Box as="figure" variant="styles.iframeWrapper" {...props} />
    }

    if (className === 'fullwidth') {
      return <Box as="figure" variant="styles.fullwidth" {...props} />
    }

    return (
      <Box
        as="figure"
        variant="styles.figure"
        className={className}
        {...props}
      />
    )
  },
  div: ({ ref, className, ...props }) => {
    if (className === 'epigraph') {
      return <Box as="div" variant="styles.epigraph" {...props} />
    }

    return <div className={className} {...props} />
  },
  span: ({ ref, className, ...props }) => {
    if (['sidenote', 'marginnote', 'newthought'].includes(className)) {
      return <Box as="span" variant={`styles.${className}`} {...props} />
    }

    return <span className={className} {...props} />
  }
}

export default MDXComponents
