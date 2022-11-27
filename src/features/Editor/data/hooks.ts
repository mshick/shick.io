import { useMutation, useQuery } from '@tanstack/react-query'
import { ClientError } from 'graphql-request'
import { useCallback, useState } from 'react'
import { useEditorContext } from './context'

export type EditorQueryOptions = {
  variables?: any
}

export type EditorQuery = (options?: any) => Promise<any>

export type EditorQueryHookProps = {
  query: EditorQuery
  options?: any
}

export type EditorMutationHookProps = {
  mutation: EditorQuery
  options?: any
}

export type EditorQueryResult = {
  called: boolean
  data: any
  error: Error | null
  loading: boolean
}

export type EditorQueryHookReturn = [EditorQuery, EditorQueryResult]
export type EditorMutationHookReturn = [EditorQuery, EditorQueryResult]

export function useEditorMethod({
  query,
  options: queryOptions
}: EditorQueryHookProps): EditorQueryHookReturn {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState<ClientError | Error | null>(null)
  const [called, setCalled] = useState(false)

  const executeQuery: EditorQuery = useCallback(
    async (options) => {
      if (loading) {
        return
      }

      setCalled(true)
      setLoading(true)

      try {
        const result = await query({ ...queryOptions, ...options })
        setData(result)
        return result
      } catch (e) {
        if (e instanceof Error || e instanceof ClientError) {
          setError(e)
          return
        }
        setError(new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    },
    [loading, query, queryOptions]
  )

  return [executeQuery, { data, called, loading, error }]
}

export function useFileTreeQuery() {
  const { methods } = useEditorContext()
  return useQuery({
    queryKey: ['fileTree'],
    queryFn: methods.getFileTree
  })
}

export function useFileTreeManualQuery() {
  const { methods } = useEditorContext()

  const query = useQuery({
    queryKey: ['fileTree'],
    queryFn: methods.getFileTree,
    enabled: false
  })

  const fetchQuery = useCallback(async () => {
    query.refetch()
  }, [query])

  return [fetchQuery, query] as const
}

export type FileQueryHookProps = {
  oid: string | undefined
  path: string | undefined
}

export function useFileQuery({ oid, path }: FileQueryHookProps) {
  const { methods } = useEditorContext()

  const query = useQuery({
    queryKey: [path ?? '', oid ?? ''],
    queryFn: methods.getFile,
    enabled: false,
    cacheTime: 0
  })

  const fetchQuery = useCallback(async () => {
    query.refetch()
  }, [query])

  return [fetchQuery, query] as const
}

export function useCreateCommitMutation() {
  const { methods } = useEditorContext()

  return useMutation({
    mutationFn: methods.createCommit
  })
}
