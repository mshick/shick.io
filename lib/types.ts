import type {
  Article as IArticle,
  Page as IPage
} from '.contentlayer/generated/types'
import type { ReactElement } from 'react'
import type { ReadTimeResults } from 'reading-time'
import { Merge, RequireAtLeastOne } from 'type-fest'

type Renderable = number | string | ReactElement | Renderable[]

export type PropsWithCallableChildren<P, Q> = P & {
  children: (arg: Q) => Renderable | undefined
}

export type GitInfo = {
  latestAuthorName: string
  latestAuthorEmail: string
  latestDate: string
}

export type SourceDate = {
  year: number
  name: string
  abbreviation: string
  initial: string
  count: number
  percent: number
  number?: number
  words?: number
}

export type Month = Omit<SourceDate, 'number' | 'words'>
export type Day = RequireAtLeastOne<SourceDate, 'number'>
export type MonthWords = RequireAtLeastOne<SourceDate, 'words'>

export type Tag = {
  name: string
  path: string
  slug: string
}

// Overrides for broken contentlayer types
export type Article = Merge<
  IArticle,
  { tags: Tag[]; readingTime: ReadTimeResults }
>
export type Page = Merge<IPage, { tags: Tag[] }>
export type DocumentTypes = Article | Page
