import {
  Article as TArticle,
  Config as TConfig,
  Page as TPage
} from 'contentlayer/generated'
import { ReactElement } from 'react'
import { Merge, SetRequired } from 'type-fest'

type Renderable = number | string | ReactElement | Renderable[]

export type PropsWithCallableChildren<P, Q> = P & {
  children: (arg: Q) => Renderable | undefined
}

export type Tag = {
  name: string
  path: string
  slug: string
}

// Overrides for incorrect contentlayer types
export type Article = Merge<
  SetRequired<TArticle, 'excerpt'>,
  {
    tags: Tag[]
    readingTime: any
    previous?: Pick<TArticle, 'title' | 'path'> | null
    next?: Pick<TArticle, 'title' | 'path'> | null
  }
>
export type Project = Merge<
  SetRequired<TArticle, 'excerpt'>,
  {
    tags: Tag[]
    previous?: Pick<TArticle, 'title' | 'path'> | null
    next?: Pick<TArticle, 'title' | 'path'> | null
  }
>
export type Page = Merge<TPage, { tags: Tag[] }>

export type DocumentTypes = Article | Page | Project

export type Config = SetRequired<TConfig, 'siteUrl'>

export type SingletonTypes = Config

export type ServerParams = Record<string, string | string[]>

export type ServerProps<Params = ServerParams> = {
  params: Params
  searchParams: ServerParams
}
