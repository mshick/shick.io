import { useCallback, useEffect, useState } from 'react'

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
  loading: boolean
  data: any
  error: Error | null
}

export type EditorQueryHookReturn = [EditorQuery, EditorQueryResult]
export type EditorMutationHookReturn = [EditorQuery, EditorQueryResult]

export function useEditorManualQuery({
  query,
  options: queryOptions
}: EditorQueryHookProps): EditorQueryHookReturn {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState<Error | null>(null)

  const executeQuery: EditorQuery = useCallback(
    async (options) => {
      setLoading(true)
      try {
        const result = await query({ ...queryOptions, ...options })
        setData(result)
        return result
      } catch (e) {
        if (e instanceof Error) {
          setError(e)
        }
        setError(new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    },
    [query, queryOptions]
  )

  return [executeQuery, { data, loading, error }]
}

export function useEditorMutation({
  mutation,
  options
}: EditorMutationHookProps): EditorMutationHookReturn {
  const [executeQuery, { loading, error, data }] = useEditorManualQuery({
    query: mutation,
    options
  })

  return [executeQuery, { data, loading, error }]
}

export function useEditorQuery({ query, options }: EditorQueryHookProps) {
  const [executeQuery, { loading, error, data }] = useEditorManualQuery({
    query,
    options
  })

  useEffect(() => {
    executeQuery(options)
  }, [executeQuery, options, query])

  return { data, loading, error }
}
