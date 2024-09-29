import { ReactElement } from 'react'

type Renderable = number | string | ReactElement | Renderable[]

export type PropsWithCallableChildren<P, Q> = P & {
  children: (arg: Q) => Renderable | undefined
}

export type Tag = {
  name: string
  path: string
  slug: string
}

export type ServerParams = Record<string, string | string[]>

export type ServerProps<Params = ServerParams> = {
  params: Params
  searchParams: ServerParams
}

export type DocumentTypes = Record<string, string>
