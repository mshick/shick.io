import { components } from 'mdx'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { Page } from 'types'

export type PageBodyProps = Pick<Page, 'body'>

export function PageBody({ body }: PageBodyProps) {
  const Component = useMDXComponent(body.code)
  return (
    <div className="prose prose-bbs prose-tss-sidenotes md:prose-tss-sidenotes-lg dark:prose-bbs-invert">
      <Component components={components} />
    </div>
  )
}
