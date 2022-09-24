import { components } from 'mdx'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { Article } from 'types'

export type ArticleBodyProps = Pick<Article, 'body'>

export function ArticleBody({ body }: ArticleBodyProps) {
  const Component = useMDXComponent(body.code)
  return (
    <div className="prose prose-high-contrast prose-tufte-sidenotes md:prose-tufte-sidenotes-lg dark:prose-invert">
      <Component components={components} />
    </div>
  )
}
