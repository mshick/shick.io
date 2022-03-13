import type { ReactElement } from 'react'
import { RequireAtLeastOne } from 'type-fest'

type Renderable = number | string | ReactElement | Renderable[]

export type PropsWithCallableChildren<P, Q> = P & {
  children: (arg: Q) => Renderable | undefined
}

export type GitInfo = {
  latestAuthorName: string | null
  latestAuthorEmail: string | null
  latestDate: string | null
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
