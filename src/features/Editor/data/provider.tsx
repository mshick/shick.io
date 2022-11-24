import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useMemo } from 'react'
import { Repo } from '../types'
import { EditorContext } from './context'
import { getMethods as getGithubMethods } from './providers/github'
import { EditorContextMethods, ProviderProps } from './types'

type GetQueriesOptions = {
  accessToken: string
  repo: Repo
}

function getMethods(
  provider: 'github',
  options: GetQueriesOptions
): EditorContextMethods {
  if (provider === 'github') {
    return getGithubMethods(options)
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
  const methods = useMemo(
    () => getMethods(provider, { accessToken, repo }),
    [accessToken, provider, repo]
  )

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <EditorContext.Provider value={{ methods }}>
        {children}
      </EditorContext.Provider>
    </QueryClientProvider>
  )
}
