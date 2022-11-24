import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { MouseEventHandler, PropsWithChildren, useCallback } from 'react'
import { useFileTreeQuery } from '../../data/hooks'
import { useFileTree } from '../../store'
import { NodeFile, Repo } from '../../types'
import { TreeParent } from './TreeParent'

function TreeWrapper({
  children,
  repo,
  onRefresh
}: PropsWithChildren<{ repo: Repo; onRefresh: () => void }>) {
  const handleRefresh: MouseEventHandler = useCallback(() => {
    onRefresh()
  }, [onRefresh])

  return (
    <div className="bg-neutral-100">
      <div className="mx-2 h-10 px-2 w-full flex align-middle items-center border-b">
        <button onClick={handleRefresh}>
          <ArrowPathIcon className="inline-block w-5 h-5 mr-2" />
        </button>
        <div className="truncate">
          {repo.owner}/{repo.name}
        </div>
      </div>
      <div className="py-4 px-2">{children}</div>
    </div>
  )
}

export type TreeRootProps = {
  repo: Repo
}

export function TreeRoot({ repo }: TreeRootProps) {
  const { error, data, refetch, isRefetching } = useFileTreeQuery()
  const { loaded } = useFileTree({ fileTree: data, isRefetching })

  if (error) {
    return (
      <TreeWrapper repo={repo} onRefresh={refetch}>
        <div>Error: {(error as Error)?.message ?? 'no data'}</div>
      </TreeWrapper>
    )
  }

  if (!loaded) {
    return (
      <TreeWrapper repo={repo} onRefresh={refetch}>
        <div>Loading...</div>
      </TreeWrapper>
    )
  }

  return (
    <TreeWrapper repo={repo} onRefresh={refetch}>
      <TreeParent node={data as NodeFile} path={[]} />
    </TreeWrapper>
  )
}
