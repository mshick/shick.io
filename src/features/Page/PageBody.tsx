import { components } from 'components/Mdx'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { Page } from 'types'

export type PageBodyProps = Pick<Page, 'body'>

export function PageBody({ body }: PageBodyProps) {
  const Component = useMDXComponent(body.code)
  return (
    <div className="prose prose-high-contrast prose-tufte-sidenotes md:prose-tufte-sidenotes-lg dark:prose-invert">
      <Component components={components} />
    </div>
  )
}
