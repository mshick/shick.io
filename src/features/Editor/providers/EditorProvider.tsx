import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useMemo } from 'react'
import { EditorContext } from '../contexts/EditorContext'
import { EditorContextMethods, Repo } from '../types'
import { getMethods as getGithubMethods } from './services/github'

export type Service = 'github'

export type GetMethodsOptions = {
  accessToken: string
  repo: Repo
}

function getMethods(
  service: Service,
  options: GetMethodsOptions
): EditorContextMethods {
  if (service === 'github') {
    return getGithubMethods(options)
  }

  throw new Error('unknown service')
}

export type EditorDataProviderProps = PropsWithChildren<
  { service: Service } & GetMethodsOptions
>

export function EditorProvider({
  service,
  children,
  accessToken,
  repo
}: EditorDataProviderProps) {
  const methods = useMemo(
    () => getMethods(service, { accessToken, repo }),
    [accessToken, service, repo]
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
