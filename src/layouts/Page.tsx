import { PropsWithChildren } from 'react'
import { LayoutDefault, LayoutDefaultProps } from './Default'

export type LayoutPageProps = LayoutDefaultProps

export const LayoutPage = ({
  seo,
  children
}: PropsWithChildren<LayoutPageProps>) => {
  return (
    <LayoutDefault seo={seo}>
      <article className="w-full max-w-3xl">{children}</article>
    </LayoutDefault>
  )
}

export default LayoutPage
