import { PropsWithChildren, useMemo } from 'react'
import { Repo } from '../types'
import { EditorContext } from './context'
import { EditorQuery } from './hooks'
import { getQueries as getGithubQueries } from './providers/github'
import { ProviderProps } from './types'

type GetQueriesReturn = {
  queries: {
    getFileTree: EditorQuery
  }
  mutations: {
    commitChanges: EditorQuery
  }
}

type GetQueriesOptions = {
  accessToken: string
  repo: Repo
}

function getQueries(
  provider: 'github',
  options: GetQueriesOptions
): GetQueriesReturn {
  if (provider === 'github') {
    return getGithubQueries(options)
  }

  throw new Error('unknown provider')
}

export type EditorDataProviderProps = PropsWithChildren<ProviderProps> & {
  accessToken: string
  repo: Repo
}

export function EditorProvider({
  provider,
  children,
  accessToken,
  repo
}: EditorDataProviderProps) {
  const { queries, mutations } = useMemo(
    () => getQueries(provider, { accessToken, repo }),
    [accessToken, provider, repo]
  )

  return (
    <EditorContext.Provider value={{ queries, mutations }}>
      {children}
    </EditorContext.Provider>
  )
}
