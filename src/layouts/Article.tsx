import { PropsWithChildren } from 'react'
import { LayoutDefault, LayoutDefaultProps } from './Default'

export interface LayoutArticleProps extends LayoutDefaultProps {}

export const LayoutArticle = ({
  seo,
  children
}: PropsWithChildren<LayoutArticleProps>) => {
  return (
    <LayoutDefault seo={seo}>
      <article className="w-full mt-6 max-w-none">{children}</article>
    </LayoutDefault>
  )
}

export default LayoutArticle
