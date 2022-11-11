import { components } from '#/mdx'
import { Article } from '#/types/types'
import { useMDXComponent } from 'next-contentlayer/hooks'

export type ArticleBodyProps = Pick<Article, 'body'>

export function ArticleBody({ body }: ArticleBodyProps) {
  const Component = useMDXComponent(body.code)
  return (
    <div className="prose prose-tufted-bbs prose-tufted-sidenotes md:prose-tufted-sidenotes-lg dark:prose-tufted-bbs-invert">
      <Component components={components} />
    </div>
  )
}
