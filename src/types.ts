import { Article as TArticle, Page as TPage } from 'contentlayer/generated'
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
  TArticle,
  {
    tags: Tag[]
    readingTime: ReadTimeResults
    previous?: Pick<TArticle, 'title' | 'path'>
    next?: Pick<TArticle, 'title' | 'path'>
  }
>
export type Page = Merge<TPage, { tags: Tag[] }>
export type DocumentTypes = Article | Page
