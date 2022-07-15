import { Article as IArticle, Page as IPage } from 'contentlayer/generated'
import { ReactElement } from 'react'
import { ReadTimeResults } from 'reading-time'
import { Merge } from 'type-fest'

type Renderable = number | string | ReactElement | Renderable[]

export type PropsWithCallableChildren<P, Q> = P & {
  children: (arg: Q) => Renderable | undefined
}

export type Tag = {
  name: string
  path: string
  slug: string
}

// Overrides for broken contentlayer types
export type Article = Merge<
  IArticle,
  {
    tags: Tag[]
    readingTime: ReadTimeResults
    previous?: Pick<IArticle, 'title' | 'path'>
    next?: Pick<IArticle, 'title' | 'path'>
  }
>
export type Page = Merge<IPage, { tags: Tag[] }>
export type DocumentTypes = Article | Page
