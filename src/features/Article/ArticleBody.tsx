import { components } from 'mdx'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { Article } from 'types'

export type ArticleBodyProps = Pick<Article, 'body'>

export function ArticleBody({ body }: ArticleBodyProps) {
  const Component = useMDXComponent(body.code)
  return (
    <div className="prose prose-bbs prose-tss-sidenotes md:prose-tss-sidenotes-lg dark:prose-bbs-invert">
      <Component components={components} />
    </div>
  )
}
