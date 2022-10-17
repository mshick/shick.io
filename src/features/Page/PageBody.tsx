import { components } from 'mdx'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { Page } from 'types'

export type PageBodyProps = Pick<Page, 'body'>

export function PageBody({ body }: PageBodyProps) {
  const Component = useMDXComponent(body.code)
  return (
    <div className="prose prose-tufted-bbs prose-tufted-sidenotes md:prose-tufted-sidenotes-lg dark:prose-tufted-invert">
      <Component components={components} />
    </div>
  )
}
