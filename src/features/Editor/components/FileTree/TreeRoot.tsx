import { ArrowPathIcon } from '@heroicons/react/24/outline'
import {
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useEffect
} from 'react'
import { useEditorContext } from '../../data/context'
import { useEditorManualQuery } from '../../data/hooks'
import { Repo } from '../../types'
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
  const { queries } = useEditorContext()
  const [getFileTree, { called, loading, error, data }] = useEditorManualQuery({
    query: queries.getFileTree
  })

  useEffect(() => {
    getFileTree()
  }, [getFileTree])

  if (loading || !called) {
    return (
      <TreeWrapper repo={repo} onRefresh={getFileTree}>
        <div>Loading...</div>
      </TreeWrapper>
    )
  }

  if (error || !data) {
    return (
      <TreeWrapper repo={repo} onRefresh={getFileTree}>
        <div>Error: {error?.message ?? 'no data'}</div>
      </TreeWrapper>
    )
  }

  return (
    <TreeWrapper repo={repo} onRefresh={getFileTree}>
      <TreeParent parentNodeAtom={data} />
    </TreeWrapper>
  )
}
