import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useEditorContext } from './context'

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
