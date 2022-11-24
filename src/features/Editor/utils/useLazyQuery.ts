import {
  FetchQueryOptions,
  QueryKey,
  useQuery, UseQueryResult
} from '@tanstack/react-query'
import { useCallback } from 'react'

export type LazyQueryFunction<
  TParams = unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = (
  params?: TParams,
  options?: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) => Promise<TData>

export type UseLazyQueryResult<
  TParams = unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = [
  LazyQueryFunction<TParams, TQueryFnData, TError, TData, TQueryKey>,
  UseQueryResult<TData, TError>
]

export const useLazyQuery = <
  TParams = unknown,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>({
  queryKey,
  queryFn
}) => {
  const query = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey,
    queryFn,
    enabled: false,
    cacheTime: 0
  })

  const fetchQuery = useCallback(async () => {
    query.refetch()
  }, [query])

  return [fetchQuery, query] as const
}
